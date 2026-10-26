import { ContentBlock, Lesson } from '../../Core/Types';
import { Strings } from '../../Core/Strings';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { Stack } from '../../Design/Primitives/Stack';
import { Text } from '../../Design/Primitives/Text';
import { Reveal } from '../../Design/Primitives/Reveal';
import { ExampleList } from '../../Design/Components/ExampleList';
import { Diagram } from '../../Design/Components/Diagram';
import { NavTitle } from '../../Design/Components/NavTitle';
import { TestBlock } from '../../Design/Components/TestBlock';
import { Button } from '../../Design/Components/Button';
import { Glyph } from '../../Design/Components/Glyph';
import { IconButton } from '../../Design/Components/IconButton';
import { PageScroll } from '../../Design/Components/PageScroll';
import styles from './LessonScreen.module.css';

/** Reveal positions for each block; an example list claims one slot per item. */
function blockStarts(blocks: ContentBlock[]): number[] {
  let next = 1;
  return blocks.map((block) => {
    const start = next;
    next += block.kind === 'Examples' ? block.items.length : 1;
    return start;
  });
}

export interface LessonScreenProps {
  lesson: Lesson;
  /** 0-based current page. */
  page: number;
  favourite: boolean;
  onBack: () => void;
  onPageChange: (page: number) => void;
  onToggleFavourite: () => void;
}

export function LessonScreen({
  lesson,
  page,
  favourite,
  onBack,
  onPageChange,
  onToggleFavourite,
}: LessonScreenProps) {
  const [currentPage, setCurrentPage] = useState(page);
  const [visiblePage, setVisiblePage] = useState(page);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testAnswered, setTestAnswered] = useState<boolean | null>(null);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const answerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [testProgress, setTestProgress] = useState<{ current: number; total: number } | null>(
    null
  );
  const handleTestProgress = useCallback((c: number, t: number) => {
    setTestProgress({ current: c, total: t });
  }, []);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pendingScroll = useRef<number | null>(null);

  // Sync to URL when the user scrolls or unlocks a page.
  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      setVisiblePage((current) => Math.max(current, newPage));
      onPageChange(newPage);
    },
    [onPageChange]
  );

  // Sync from URL when deep-linking or using back/forward.
  useEffect(() => {
    setCurrentPage(page);
    setVisiblePage((current) => Math.max(current, page));
  }, [page]);

  // Scroll to a page once its newly unlocked content is mounted.
  useEffect(() => {
    const target = pendingScroll.current;
    if (target === null) return;
    pendingScroll.current = null;
    pageRefs.current[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [visiblePage]);

  useEffect(() => {
    return () => {
      if (answerTimer.current) clearTimeout(answerTimer.current);
    };
  }, []);

  return (
    <div class={styles.Root}>
      <div class={styles.TopBar}>
        <Button variant="Secondary" onClick={onBack}>
          <Glyph name="ArrowLeft" />
          {Strings.backToLessons}
        </Button>
        <IconButton
          variant="Glass"
          label={favourite ? Strings.removeFavouriteLabel : Strings.addFavouriteLabel}
          onClick={onToggleFavourite}
        >
          <Glyph name={favourite ? 'StarFilled' : 'Star'} />
        </IconButton>
      </div>

      <div class={styles.Main}>
        <PageScroll currentPage={currentPage} onPageChange={handlePageChange}>
          {lesson.pages.slice(0, visiblePage + 1).map((pageContent, pageIndex) => {
            const starts = blockStarts(pageContent.blocks);
            const isLast = pageIndex === lesson.pages.length - 1;
            const isFrontier = pageIndex === visiblePage;
            return (
              <div
                key={pageIndex}
                class={`${styles.Page} ${pageIndex > 0 ? styles.PageSeparated : ''} ${pageContent.nav === 'Тест' ? styles.PageTest : ''} ${pageContent.nav === 'Тест' && (testResult !== null ? testResult : testAnswered) === true ? styles.PageTestPass : ''} ${pageContent.nav === 'Тест' && (testResult !== null ? testResult : testAnswered) === false ? styles.PageTestFail : ''}`}
                ref={(element) => {
                  pageRefs.current[pageIndex] = element;
                }}
              >
                <Reveal index={0}>
                  <NavTitle
                    title={pageContent.nav}
                    seed={lesson.id + pageIndex}
                    index={pageIndex + 1}
                    progress={
                      pageContent.blocks.some((b) => b.kind === 'Test')
                        ? (testProgress ?? undefined)
                        : undefined
                    }
                  />
                </Reveal>
                <Stack gap="Lg" padded={false}>
                  {pageContent.blocks.map((block, blockIndex) => {
                    if (block.kind === 'Examples') {
                      return (
                        <ExampleList
                          key={blockIndex}
                          items={block.items}
                          startIndex={starts[blockIndex]}
                          lessonId={lesson.id}
                          pageIndex={pageIndex}
                        />
                      );
                    }
                    if (block.kind === 'Diagram') {
                      return (
                        <Reveal key={blockIndex} index={starts[blockIndex]}>
                          <Diagram
                            nodes={block.nodes}
                            edges={block.edges}
                            start={block.start}
                          />
                        </Reveal>
                      );
                    }
                    if (block.kind === 'Test') {
                      return (
                        <Reveal key={blockIndex} index={starts[blockIndex]}>
                          <TestBlock
                            test={block.test}
                            onComplete={(passed) => {
                              setTestCompleted(true);
                              setTestResult(passed);
                            }}
                            onFinish={onBack}
                            onProgress={handleTestProgress}
                            onAnswered={(correct) => {
                              if (answerTimer.current) clearTimeout(answerTimer.current);
                              setTestAnswered(correct);
                              if (correct !== null) {
                                answerTimer.current = setTimeout(() => {
                                  setTestAnswered(null);
                                  answerTimer.current = null;
                                }, 800);
                              }
                            }}
                          />
                        </Reveal>
                      );
                    }
                    return (
                      <Reveal key={blockIndex} index={starts[blockIndex]}>
                        <Text variant={block.kind === 'Subtitle' ? 'Subtitle' : 'Body'}>
                          {block.text}
                        </Text>
                      </Reveal>
                    );
                  })}
                </Stack>
                {isFrontier && !pageContent.blocks.some((b) => b.kind === 'Test') && (
                  <Button
                    variant={isLast ? 'Success' : 'Subtle'}
                    disabled={isLast && !testCompleted}
                    onClick={
                      isLast
                        ? onBack
                        : () => {
                            pendingScroll.current = pageIndex + 1;
                            handlePageChange(pageIndex + 1);
                          }
                    }
                  >
                    {isLast ? Strings.finish : Strings.understood}
                  </Button>
                )}
              </div>
            );
          })}
        </PageScroll>
      </div>
    </div>
  );
}
