import { Stack } from "@/Design/Primitives/Stack.tsx";
import { Button } from "@/Design/Components/Button.tsx";

export function App() {
  return (
    <Stack gap="Lg">
      <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
        English Learning
      </h1>
      <p style={{ margin: 0, color: "var(--Color-Text-Secondary)" }}>
        Mobile-first unified design. Max-width: iPhone style.
      </p>
      <Button onClick={() => alert("Start learning!")}>Start Lesson</Button>
    </Stack>
  );
}
