import { Question } from '../questions/question.model';
import { Article } from '../articles/article.model';
import { Lab } from '../labs/lab.model';

export interface Course {
  courseId: string;
  name: string;
  icon: string;
  objective: string; // i.e. description
  questions: Question[];
  articles: Article[];
  labs: Lab[];
}
