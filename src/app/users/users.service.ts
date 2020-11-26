import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from './user.model';
import { environment } from '../../environments/environment';
import { ID } from '../shared/models/id.model';
import { DeleteResponse } from '../shared/models/delete-response.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  deleteUser(userId: ID): Observable<DeleteResponse> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`);
  }
}
