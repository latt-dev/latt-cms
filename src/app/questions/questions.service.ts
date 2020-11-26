import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Question } from './question.model';
import { ID } from '../shared/models/id.model';
import { DeleteResponse } from '../shared/models/delete-response.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`);
  }

  getQuestion(questionId: ID): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/questions/${questionId}`);
  }

  createQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions`, question);
  }

  updateQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.patch<Question>(`${this.apiUrl}/questions/${question.questionId}`, question);
  }

  deleteQuestion(questionId: ID): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/questions/${questionId}`);
  }
}
