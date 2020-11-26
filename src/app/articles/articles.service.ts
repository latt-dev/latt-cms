import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Article } from './article.model';
import { ID } from '../shared/models/id.model';
import { DeleteResponse } from '../shared/models/delete-response.model';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articles`);
  }

  getArticle(articleId: ID): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${articleId}`);
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/articles`, article);
  }

  updateArticle(article: Partial<Article>): Observable<Article> {
    return this.http.patch<Article>(`${this.apiUrl}/articles/${article.articleId}`, article);
  }

  deleteArticle(articleId: ID): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/articles/${articleId}`);
  }
}
