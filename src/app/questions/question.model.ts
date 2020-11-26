import { Course } from '../courses/course.model';
import { ID } from '../shared/models/id.model';

export enum OptionId {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export interface QuestionOption {
  optionId: OptionId;
  text: string;
}

export interface Question {
  questionId: ID;
  text: string;
  options: QuestionOption[];
  answer: OptionId; // correct answer
  course: Course;
}
