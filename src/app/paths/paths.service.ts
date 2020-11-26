import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Path } from './path.model';
import { ID } from '../shared/models/id.model';
import { DeleteResponse } from '../shared/models/delete-response.model';

@Injectable({
  providedIn: 'root',
})
export class PathsService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getPaths(): Observable<Path[]> {
    return this.http.get<Path[]>(`${this.apiUrl}/paths`);
  }

  getPath(pathId: ID): Observable<Path> {
    return this.http.get<Path>(`${this.apiUrl}/paths/${pathId}`);
  }

  createPath(path: Partial<Path>): Observable<Path> {
    return this.http.post<Path>(`${this.apiUrl}/paths`, path);
  }

  updatePath(path: Partial<Path>): Observable<Path> {
    return this.http.patch<Path>(`${this.apiUrl}/paths/${path.pathId}`, path);
  }

  deletePath(pathId: ID): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/paths/${pathId}`);
  }
}
