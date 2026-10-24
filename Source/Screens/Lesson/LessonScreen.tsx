import { ContentBlock, Lesson } from '../../Core/Types';
import { Strings } from '../../Core/Strings';
import { Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Stack } from '../../Design/Primitives/Stack';
import { Text } from '../../Design/Primitives/Text';
import { Reveal } from '../../Design/Primitives/Reveal';
import { ExampleList } from '../../Design/Components/ExampleList';
import { Button } from '../../Design/Components/Button';
import { Glyph } from '../../Design/Components/Glyph';
import { IconButton } from '../../Design/Components/IconButton';
import { PageScroll } from '../../Design/Components/PageScroll';
import { LessonTimeline } from '../../Design/Components/LessonTimeline';
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
  /** 0-based furthest page reached; drives timeline reachability. */
  reachedPage: number;
  favourite: boolean;
  onBack: () => void;
  onPageChange: (page: number) => void;
  onToggleFavourite: () => void;
}

export function LessonScreen({
  lesson,
  page,
  reachedPage,
  favourite,
  onBack,
  onPageChange,
  onToggleFavourite,
}: LessonScreenProps) {
  const [currentPage, setCurrentPage] = useState(page);

  // Sync to URL when the user scrolls or taps the timeline.
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  // Sync from URL when deep-linking or using back/forward.
  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

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
          {lesson.pages.map((pageContent, pageIndex) => {
            const starts = blockStarts(pageContent.blocks);
            return (
              <Fragment key={pageIndex}>
                <Reveal index={0}>
                  <Text variant="Title">{pageContent.nav}</Text>
                </Reveal>
                <Stack gap="Md" padded={false}>
                  {pageContent.blocks.map((block, blockIndex) => {
                    if (block.kind === 'Examples') {
                      return (
                        <ExampleList
                          key={blockIndex}
                          items={block.items}
                          startIndex={starts[blockIndex]}
                        />
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
              </Fragment>
            );
          })}
        </PageScroll>
        <LessonTimeline
          pages={lesson.pages}
          currentPage={currentPage}
          reachedPage={reachedPage}
          onPageClick={handlePageChange}
        />
      </div>
    </div>
  );
}
