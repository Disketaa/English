import { Fragment } from 'preact';
import { Lesson } from '../../Core/Types';
import { Strings } from '../../Core/Strings';
import { Stack } from '../../Design/Primitives/Stack';
import { Text } from '../../Design/Primitives/Text';
import { ExampleList } from '../../Design/Components/ExampleList';
import { Pagination } from '../../Design/Components/Pagination';
import { Button } from '../../Design/Components/Button';
import styles from './LessonScreen.module.css';

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
          {Strings.backToLessons}
        </Button>
      </Stack>
    );
  }

  const isLast = page >= lesson.pages.length - 1;

  return (
    <Stack gap="Lg">
      <div class={styles.TopBar}>
        <Button variant="Secondary" onClick={onBack}>
          {Strings.backToLessons}
        </Button>
        <Button variant="Secondary" onClick={onToggleFavourite}>
          {favourite ? Strings.isFavourite : Strings.addFavourite}
        </Button>
      </div>

      <div key={page} class={styles.Page}>
        <Stack gap="Xs" padded={false}>
          <Text variant="Title">{lesson.title}</Text>
          <Text variant="Caption">{current.nav}</Text>
        </Stack>
        <Stack gap="Md" padded={false}>
          {current.blocks.map((block, index) => (
            <Fragment key={index}>
              {block.kind === 'Examples' && <ExampleList items={block.items} />}
              {block.kind === 'Subtitle' && <Text variant="Subtitle">{block.text}</Text>}
              {block.kind === 'Text' && <Text variant="Body">{block.text}</Text>}
            </Fragment>
          ))}
        </Stack>
      </div>

      <Pagination
        page={page}
        pageCount={lesson.pages.length}
        onPrevious={() => onPageChange(page - 1)}
        onNext={() => (isLast ? onBack() : onPageChange(page + 1))}
      />
    </Stack>
  );
}
