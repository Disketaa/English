import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { highlightNodes } from '../Primitives/Text';
import styles from './Diagram.module.css';
import { DiagramEdge, DiagramNode } from '../../Core/Types';

/** Node size by kind (px, pre-scale). */
const NodeW = { question: 150, result: 140 };
const NodeH = { question: 56, result: 64 };
const GapX = 16;
const LayerH = 150;
const Pad = 16;

interface Pos {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Layout a flowchart top-down, returning unscaled positions and edge paths. */
function computeLayout(nodes: DiagramNode[], edges: DiagramEdge[], start: string) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const succ = new Map<string, DiagramEdge[]>();
  for (const e of edges) {
    const fromList = succ.get(e.from);
    if (fromList) fromList.push(e);
    else succ.set(e.from, [e]);
  }

  // Longest-path layers from the start node (topological order).
  const layer = new Map<string, number>([[start, 0]]);
  const order: string[] = [start];
  const seen = new Set([start]);
  for (let i = 0; i < order.length; i++) {
    const u = order[i];
    for (const e of succ.get(u) ?? []) {
      const cand = (layer.get(u) ?? 0) + 1;
      if (cand > (layer.get(e.to) ?? -1)) layer.set(e.to, cand);
      if (!seen.has(e.to)) {
        seen.add(e.to);
        order.push(e.to);
      }
    }
  }
  for (const n of nodes) {
    if (!layer.has(n.id)) {
      layer.set(n.id, order.length);
      order.push(n.id);
    }
  }

  // Group nodes by layer, preserving discovery order.
  const layers: string[][] = [];
  for (const id of order) {
    const l = layer.get(id) ?? 0;
    const existing = layers[l];
    if (existing) existing.push(id);
    else layers[l] = [id];
  }

  const size = (id: string) => {
    const n = byId.get(id);
    if (!n) return { w: NodeW.question, h: NodeH.question };
    return n.kind === 'result'
      ? { w: NodeW.result, h: NodeH.result }
      : { w: NodeW.question, h: NodeH.question };
  };

  let canvasW = 0;
  const layerInfos = layers.map((ids) => {
    const infos = ids.map((id) => ({ id, ...size(id) }));
    const w = infos.reduce((s, { w }) => s + w, 0) + GapX * Math.max(0, infos.length - 1);
    canvasW = Math.max(canvasW, w);
    return infos;
  });

  const pos = new Map<string, Pos>();
  let maxH = 0;
  layerInfos.forEach((infos, li) => {
    const totalW = infos.reduce((s, { w }) => s + w, 0) + GapX * Math.max(0, infos.length - 1);
    let x = (canvasW - totalW) / 2;
    const y = li * LayerH;
    for (const info of infos) {
      pos.set(info.id, { x, y, w: info.w, h: info.h });
      x += info.w + GapX;
      maxH = Math.max(maxH, y + info.h);
    }
  });
  const canvasH = maxH;

  const edgePaths = new Map<string, string>();
  const choicePoints = new Map<string, { x: number; y: number }>();
  for (const e of edges) {
    const s = pos.get(e.from);
    const t = pos.get(e.to);
    if (!s || !t) continue;
    const p0 = { x: s.x + s.w / 2, y: s.y + s.h };
    const p2 = { x: t.x + t.w / 2, y: t.y };
    const midY = (p0.y + p2.y) / 2;
    const r = 12;
    const dx = p2.x > p0.x ? 1 : -1;
    // Corner 1: (p0.x, midY) - going down then horizontal
    // Corner 2: (p2.x, midY) - going horizontal then down
    const path = [
      `M ${p0.x} ${p0.y}`,
      `L ${p0.x} ${midY - r}`,
      `Q ${p0.x} ${midY} ${p0.x + dx * r} ${midY}`,
      `L ${p2.x - dx * r} ${midY}`,
      `Q ${p2.x} ${midY} ${p2.x} ${midY + r}`,
      `L ${p2.x} ${p2.y}`,
    ].join(' ');
    edgePaths.set(e.from + e.to, path);
    const c = { x: (p0.x + p2.x) / 2, y: midY };
    choicePoints.set(e.from + e.to, c);
  }

  // Apply padding: shift all positions and expand canvas.
  for (const p of pos.values()) {
    p.x += Pad;
    p.y += Pad;
  }
  for (const key of edgePaths.keys()) {
    const d = edgePaths.get(key);
    if (d) {
      edgePaths.set(
        key,
        d.replace(/-?\d+\.?\d*/g, (m) => String(Number(m) + Pad))
      );
    }
  }
  for (const c of choicePoints.values()) {
    c.x += Pad;
    c.y += Pad;
  }
  const paddedW = canvasW + Pad * 2;
  const paddedH = canvasH + Pad * 2;

  return { canvasW: paddedW, canvasH: paddedH, pos, edgePaths, choicePoints };
}

export interface DiagramProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  /** Id of the root node. */
  start: string;
}

export function Diagram({ nodes, edges, start }: DiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const { canvasW, canvasH, pos, edgePaths, choicePoints } = computeLayout(nodes, edges, start);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = containerWidth > 0 ? Math.min(1, containerWidth / canvasW) : 1;
  const scaledW = canvasW * scale;
  const scaledH = canvasH * scale;
  const leftOffset = containerWidth > 0 ? (containerWidth - scaledW) / 2 : 0;

  const placed = nodes
    .map((n) => ({ n, p: pos.get(n.id) }))
    .filter((x): x is { n: DiagramNode; p: Pos } => x.p !== undefined);

  const edgeEntries = edges
    .map((e) => ({
      e,
      d: edgePaths.get(e.from + e.to),
      c: choicePoints.get(e.from + e.to),
    }))
    .filter(
      (x): x is { e: DiagramEdge; d: string; c: { x: number; y: number } } =>
        x.d !== undefined && x.c !== undefined
    );

  return (
    <div ref={containerRef} class={styles.Outer} style={{ height: scaledH }}>
      <div
        class={styles.Wrapper}
        style={{
          left: leftOffset,
          width: canvasW,
          height: canvasH,
          transform: `scale(${scale})`,
        }}
      >
        <svg class={styles.Svg} width={canvasW} height={canvasH}>
          {edgeEntries.map(({ e, d }) => (
            <path key={e.from + e.to} d={d} class={styles.Edge} />
          ))}
        </svg>
        {placed.map(({ n, p }) => (
          <div
            key={n.id}
            class={`${styles.Node} ${styles[n.kind.charAt(0).toUpperCase() + n.kind.slice(1)]}`}
            style={{
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.h,
            }}
          >
            {highlightNodes(n.text)}
          </div>
        ))}
        {edgeEntries.map(({ e, c }) => (
          <div
            key={e.from + e.to}
            class={styles.Choice}
            style={{
              left: c.x,
              top: c.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {e.label}
          </div>
        ))}
      </div>
    </div>
  );
}
