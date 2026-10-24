/** Lesson content data. */
export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  topic: string;
  locked?: boolean;
}

export const lessons: Lesson[] = [
  {
    id: 'articles',
    title: 'Артикли',
    subtitle: 'a, an, the — когда использовать каждый',
    topic: 'articles',
  },
  {
    id: 'pronouns',
    title: 'Местоимения',
    subtitle: 'I, you, he, she, it, we, they — личные местоимения',
    topic: 'pronouns',
    locked: true,
  },
];
