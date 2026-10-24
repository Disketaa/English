import { Lesson } from '../../Core/Types';
import { Strings } from '../../Core/Strings';
import { Stack } from '../../Design/Primitives/Stack';
import { Text } from '../../Design/Primitives/Text';
import { ModuleBlock } from '../../Design/Components/ModuleBlock';

export interface HomeScreenProps {
  lessons: Lesson[];
  onOpen: (lessonId: string) => void;
}

export function HomeScreen({ lessons, onOpen }: HomeScreenProps) {
  return (
    <Stack gap="Lg">
      <Stack gap="Xs" padded={false}>
        <Text variant="Title">{Strings.appTitle}</Text>
        <Text variant="Caption">{Strings.appSubtitle}</Text>
      </Stack>

      <main>
        <Stack gap="Md" padded={false}>
          {lessons.map((lesson, index) => (
            <ModuleBlock
              key={lesson.id}
              title={lesson.title}
              subtitle={lesson.subtitle}
              moduleNumber={index + 1}
              locked={lesson.locked}
              seed={lesson.id}
              onClick={lesson.locked ? undefined : () => onOpen(lesson.id)}
            />
          ))}
        </Stack>
      </main>
    </Stack>
  );
}
