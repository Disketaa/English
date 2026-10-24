import { Lesson } from '../../Core/Types';
import { articlesLesson } from './Articles';
import { pronounsLesson } from './Pronouns';

/** Lesson registry in display order. Add a lesson by importing it here. */
export const lessons: Lesson[] = [articlesLesson, pronounsLesson];
