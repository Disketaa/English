/** One test question. */
export interface TestQuestion {
  /** Unique id. */
  id: string;
  /** The question text (may contain ___ for blanks). */
  prompt: string;
  /** Correct answer (multiple parts separated by " / "). */
  answer: string;
  /** Explanation shown after answering. */
  explanation: string;
  /** Question type. */
  type: 'fill' | 'translate';
}

/** A test attached to a lesson. */
export interface Test {
  title: string;
  questions: TestQuestion[];
  scoring: { excellent: number; good: number };
}

/** One renderable piece of a lesson page. */
export type ContentBlock =
  | { kind: 'Subtitle'; text: string }
  | { kind: 'Text'; text: string }
  | { kind: 'Examples'; items: string[] }
  | { kind: 'Diagram'; nodes: DiagramNode[]; edges: DiagramEdge[]; start: string }
  | { kind: 'Test'; test: Test };

/** A node in a lesson flowchart diagram. */
export interface DiagramNode {
  id: string;
  text: string;
  kind: 'question' | 'result';
}

/** A directed edge between diagram nodes, labelled with the answer choice. */
export interface DiagramEdge {
  from: string;
  to: string;
  label: 'Да' | 'Нет';
}

/** One paginated screen of a lesson. */
export interface LessonPage {
  /** Title shown at the top of the page. */
  nav: string;
  blocks: ContentBlock[];
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  topic: string;
  locked?: boolean;
  pages: LessonPage[];
}

/** Per-lesson progress persisted in localStorage. */
export interface LessonProgress {
  /** 0-based index of the last opened page. */
  page: number;
  favourite: boolean;
}

export type Progress = Record<string, LessonProgress>;
