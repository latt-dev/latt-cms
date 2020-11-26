import { Course } from '../courses/course.model';

export interface Article {
  articleId: string;
  url: string;
  name: string;
  description: string;
  duration: string;
  course: Course;
}
