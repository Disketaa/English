import { Stack } from "../Design/Primitives/Stack";
import { Button } from "../Design/Components/Button";
import { ModuleBlock } from "../Design/Components/ModuleBlock";

export function App() {
  return (
    <Stack gap="Lg">
      <ModuleBlock
        title="Yoga Workouts"
        subtitle="2 of 5 completed"
        progressLabel="45'"
      />
      <Button onClick={() => alert("Start learning!")}>Start Lesson</Button>
    </Stack>
  );
}
