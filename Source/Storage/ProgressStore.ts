import { LessonProgress, Progress } from '../Core/Types';

const storageKey = 'english.progress.v1';

export const emptyLessonProgress: LessonProgress = { page: 0, favourite: false };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readLessonProgress(value: unknown): LessonProgress {
  if (!isRecord(value)) return emptyLessonProgress;
  const page =
    typeof value.page === 'number' && Number.isInteger(value.page) && value.page >= 0
      ? value.page
      : 0;
  return { page, favourite: value.favourite === true };
}

export function loadProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed: unknown = raw === null ? {} : JSON.parse(raw);
    if (!isRecord(parsed)) return {};
    const progress: Progress = {};
    for (const lessonId of Object.keys(parsed)) {
      progress[lessonId] = readLessonProgress(parsed[lessonId]);
    }
    return progress;
  } catch {
    // Corrupt or blocked storage: start from a clean slate.
    return {};
  }
}

export function saveProgress(progress: Progress): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // Storage can be full or blocked; the session keeps working from memory.
  }
}
