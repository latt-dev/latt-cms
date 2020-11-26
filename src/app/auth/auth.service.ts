import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthDialogResult } from '../shared/ui/auth-dialog/auth-dialog.models';
import { User } from '../users/user.model';
import { concatMap, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string = environment.apiURL;
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  get token(): string {
    return localStorage.getItem('access_token');
  }

  set token(val: string) {
    if (val) {
      localStorage.setItem('access_token', val);
    } else {
      localStorage.clear();
    }
  }

  constructor(private http: HttpClient, private router: Router) {}

  checkAuthState() {
    if (!!this.token) {
      this.isAuthenticated$.next(true);
    }
  }

  signIn(payload: AuthDialogResult): Observable<User> {
    const user = { userName: payload.userName, password: payload.password };
    return this.http.post<User>(`${this.apiUrl}/users/signin`, user).pipe(
      concatMap((userResponse: User) => {
        this.token = userResponse.token;
        this.isAuthenticated$.next(true);
        return of(userResponse);
      })
    );
  }

  signUp(payload: AuthDialogResult): Observable<User> {
    const user = { userName: payload.userName, password: payload.password, code: payload.code };
    return this.http.post<User>(`${this.apiUrl}/users/signup`, user).pipe(
      concatMap((userResponse: User) => {
        this.token = userResponse.token;
        this.isAuthenticated$.next(true);
        return of(userResponse);
      })
    );
  }

  signOut(): void {
    this.token = null;
    this.isAuthenticated$.next(false);
    this.router.navigate(['home']);
  }
}
