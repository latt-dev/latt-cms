import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Lab } from './lab.model';
import { ID } from '../shared/models/id.model';
import { DeleteResponse } from '../shared/models/delete-response.model';

@Injectable({
  providedIn: 'root',
})
export class LabsService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getLabs(): Observable<Lab[]> {
    return this.http.get<Lab[]>(`${this.apiUrl}/labs`);
  }

  getLab(labId: ID): Observable<Lab> {
    return this.http.get<Lab>(`${this.apiUrl}/labs/${labId}`);
  }

  createLab(lab: Partial<Lab>): Observable<Lab> {
    return this.http.post<Lab>(`${this.apiUrl}/labs`, lab);
  }

  updateLab(lab: Partial<Lab>): Observable<Lab> {
    return this.http.patch<Lab>(`${this.apiUrl}/labs/${lab.labId}`, lab);
  }

  deleteLab(labId: ID): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/labs/${labId}`);
  }
}
