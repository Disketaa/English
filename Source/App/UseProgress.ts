import { useEffect, useState } from 'preact/hooks';
import { LessonProgress, Progress } from '../Core/Types';
import { emptyLessonProgress, loadProgress, saveProgress } from '../Storage/ProgressStore';

export interface ProgressApi {
  progress: Progress;
  patchLesson: (lessonId: string, update: Partial<LessonProgress>) => void;
}

export function useProgress(): ProgressApi {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const patchLesson = (lessonId: string, update: Partial<LessonProgress>) => {
    setProgress((prev) => ({
      ...prev,
      [lessonId]: { ...emptyLessonProgress, ...prev[lessonId], ...update },
    }));
  };

  return { progress, patchLesson };
}
