import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { PathsService } from './paths.service';
import { Path } from './path.model';
import { ID } from '../shared/models/id.model';
import { exhaustMap, filter, map, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeletionDialogComponent } from '../shared/ui/confirm-deletion-dialog/confirm-deletion-dialog.component';

@Component({
  selector: 'latt-paths',
  templateUrl: './paths.component.html',
  styles: [
    '.latt-paths {height: 100%;}',
    'li:not(:last-child) { padding-bottom: 8px; }',
    '.path-logo { height: 48px; margin-right: 8px; }',
    '.path-name { margin-right: 8px; }',
    '.add-path-fab { position: absolute; bottom: 16px; right: 16px; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PathsComponent implements OnInit, OnDestroy {
  paths$ = new BehaviorSubject<Path[]>([]);
  loaded$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();

  constructor(private pathsService: PathsService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.pathsService
      .getPaths()
      .pipe(takeUntil(this.destroy$))
      .subscribe((paths) => {
        this.paths$.next(paths);
        this.loaded$.next(true);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  createPath(): void {
    this.router.navigate(['paths', 'new']);
  }

  editPath(pathId: ID): void {
    this.router.navigate(['paths', pathId]);
  }

  deletePath(pathId: ID): void {
    this.dialog
      .open(ConfirmDeletionDialogComponent)
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => this.loaded$.next(false)),
        exhaustMap(() => this.pathsService.deletePath(pathId)),
        withLatestFrom(this.paths$),
        take(1)
      )
      .subscribe(([{ id }, paths]) => {
        this.paths$.next(paths.filter((path) => path.pathId !== id));
        this.loaded$.next(true);
      });
    this.pathsService.deletePath(pathId);
  }
}
