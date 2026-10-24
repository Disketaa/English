import { Stack } from '../Design/Primitives/Stack';
import { ModuleBlock } from '../Design/Components/ModuleBlock';
import { lessons } from '../Content/Lessons';

export function App() {
  return (
    <Stack gap="Lg">
      <header>
        <h1>English Learning</h1>
        <p>Mobile-first unified design. iPhone-style layout.</p>
      </header>

      <main>
        <Stack gap="Md">
          {lessons.map((lesson, index) => (
            <ModuleBlock
              key={lesson.id}
              title={lesson.title}
              subtitle={lesson.subtitle}
              moduleNumber={index + 1}
              locked={lesson.locked}
            />
          ))}
        </Stack>
      </main>
    </Stack>
  );
}
