import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { User } from './user.model';
import { UsersService } from './users.service';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ID } from '../shared/models/id.model';

@Component({
  selector: 'latt-users',
  template: `
    <div class="latt-users">
      <mat-toolbar><span>Users</span></mat-toolbar>

      <ng-container *ngIf="loaded$ | async; else loading">
        <ul class="latt-viewport-padding">
          <li *ngFor="let user of users$ | async">
            <mat-card fxLayout="row" fxLayoutAlign="start center">
              <div class="user-name mat-body-strong">{{ user.userName }}</div>
              <span fxFlex></span>
              <button mat-icon-button aria-label="delete user" (click)="deleteUser(user.userId)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card>
          </li>
        </ul>
      </ng-container>

      <ng-template #loading>
        <latt-loading></latt-loading>
      </ng-template>
    </div>
  `,
  styles: ['.latt-users {height: 100%;}', 'li:not(:last-child) { padding-bottom: 8px; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit, OnDestroy {
  users$ = new BehaviorSubject<User[]>([]);
  loaded$ = new BehaviorSubject(false);
  destroy$ = new Subject<void>();

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users$.next(users);
        this.loaded$.next(true);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  deleteUser(userId: ID): void {
    this.loaded$.next(false);
    this.usersService
      .deleteUser(userId)
      .pipe(
        withLatestFrom(this.users$),
        map(([{ id }, users]) => users.filter((user) => user.userId !== id))
      )
      .subscribe((users) => {
        this.users$.next(users);
        this.loaded$.next(true);
      });
  }
}
