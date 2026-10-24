/** One renderable piece of a lesson page. */
export type ContentBlock =
  | { kind: 'Subtitle'; text: string }
  | { kind: 'Text'; text: string }
  | { kind: 'Examples'; items: string[] };

/** One paginated screen of a lesson. */
export interface LessonPage {
  /** Title shown at the top of the page. */
  nav: string;
  blocks: ContentBlock[];
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  topic: string;
  locked?: boolean;
  pages: LessonPage[];
}

/** Per-lesson progress persisted in localStorage. */
export interface LessonProgress {
  /** 0-based index of the last opened page. */
  page: number;
  favourite: boolean;
}

export type Progress = Record<string, LessonProgress>;
