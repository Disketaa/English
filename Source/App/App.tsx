import { lessons } from '../Content/Lessons';
import { HomeScreen } from '../Screens/Home/HomeScreen';
import { LessonScreen } from '../Screens/Lesson/LessonScreen';
import { emptyLessonProgress } from '../Storage/ProgressStore';
import { homeUrl, lessonUrl, navigate, useRoute } from './UseRoute';
import { useProgress } from './UseProgress';

export function App() {
  const route = useRoute();
  const { progress, patchLesson } = useProgress();

  const lesson =
    route.name === 'Lesson' ? lessons.find((item) => item.id === route.lessonId) : undefined;
  const stored =
    lesson === undefined ? emptyLessonProgress : (progress[lesson.id] ?? emptyLessonProgress);
  const lastPage = lesson === undefined ? 0 : Math.max(0, lesson.pages.length - 1);
  const page = Math.min(route.name === 'Lesson' ? route.page : 0, lastPage);

  const openLesson = (lessonId: string) => {
    const storedPage = progress[lessonId]?.page ?? 0;
    window.scrollTo(0, 0);
    navigate(lessonUrl(lessonId, storedPage));
  };

  if (lesson === undefined) {
    return <HomeScreen lessons={lessons} onOpen={openLesson} />;
  }

  return (
    <LessonScreen
      lesson={lesson}
      page={page}
      favourite={stored.favourite}
      onBack={() => navigate(homeUrl())}
      onPageChange={(next) => {
        navigate(lessonUrl(lesson.id, next));
        patchLesson(lesson.id, { page: next });
      }}
      onToggleFavourite={() => patchLesson(lesson.id, { favourite: !stored.favourite })}
    />
  );
}
