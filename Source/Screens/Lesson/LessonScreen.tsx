import { ContentBlock, Lesson } from '../../Core/Types';
import { Strings } from '../../Core/Strings';
import { Stack } from '../../Design/Primitives/Stack';
import { Text } from '../../Design/Primitives/Text';
import { Reveal } from '../../Design/Primitives/Reveal';
import { ExampleList } from '../../Design/Components/ExampleList';
import { Pagination } from '../../Design/Components/Pagination';
import { Button } from '../../Design/Components/Button';
import { Glyph } from '../../Design/Components/Glyph';
import { IconButton } from '../../Design/Components/IconButton';
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
  const current = lesson.pages[page];
  if (current === undefined) {
    return (
      <Stack gap="Lg">
        <Text variant="Title">{lesson.title}</Text>
        <Text variant="Body">{Strings.emptyLesson}</Text>
        <Button variant="Secondary" onClick={onBack}>
          <Glyph name="ArrowLeft" />
          {Strings.backToLessons}
        </Button>
      </Stack>
    );
  }

  const isLast = page >= lesson.pages.length - 1;
  const starts = blockStarts(current.blocks);

  return (
    <div class={styles.Root}>
      <Stack gap="Lg">
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

        <div key={page} class={styles.Page}>
          <Reveal index={0}>
            <Text variant="Title">{current.nav}</Text>
          </Reveal>
          <Stack gap="Md" padded={false}>
            {current.blocks.map((block, index) => {
              if (block.kind === 'Examples') {
                return (
                  <ExampleList key={index} items={block.items} startIndex={starts[index]} />
                );
              }

              return (
                <Reveal key={index} index={starts[index]}>
                  <Text variant={block.kind === 'Subtitle' ? 'Subtitle' : 'Body'}>
                    {block.text}
                  </Text>
                </Reveal>
              );
            })}
          </Stack>
        </div>
      </Stack>

      <Pagination
        page={page}
        pageCount={lesson.pages.length}
        onPrevious={() => onPageChange(page - 1)}
        onNext={() => (isLast ? onBack() : onPageChange(page + 1))}
      />
    </div>
  );
}
