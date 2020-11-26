import { ID } from '../shared/models/id.model';
import { Course } from '../courses/course.model';

export interface Path {
  pathId: ID;
  name: string;
  icon: string;
  courses: Course[];
}
