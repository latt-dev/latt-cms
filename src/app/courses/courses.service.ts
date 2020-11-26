import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Course } from './course.model';
import { ID } from '../shared/models/id.model';
import { DeleteResponse } from '../shared/models/delete-response.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  getCourse(courseId: ID): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${courseId}`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses`, course);
  }

  updateCourse(course: Partial<Course>): Observable<Course> {
    return this.http.patch<Course>(`${this.apiUrl}/courses/${course.courseId}`, course);
  }

  deleteCourse(courseId: ID): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/courses/${courseId}`);
  }
}
