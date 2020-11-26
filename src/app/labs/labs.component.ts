import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { exhaustMap, filter, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

import { Lab } from './lab.model';
import { LabsService } from './labs.service';
import { ID } from '../shared/models/id.model';
import { ConfirmDeletionDialogComponent } from '../shared/ui/confirm-deletion-dialog/confirm-deletion-dialog.component';

@Component({
  selector: 'latt-labs',
  templateUrl: './labs.component.html',
  styles: [
    '.latt-labs {height: 100%;}',
    'li:not(:last-child) { padding-bottom: 8px; }',
    '.lab-name { margin-right: 8px; }',
    '.add-lab-fab { position: absolute; bottom: 16px; right: 16px; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabsComponent implements OnInit, OnDestroy {
  labs$ = new BehaviorSubject<Lab[]>([]);
  loaded$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();

  constructor(private labsService: LabsService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.labsService
      .getLabs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((labs) => {
        this.labs$.next(labs);
        this.loaded$.next(true);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  createLab(): void {
    this.router.navigate(['labs', 'new']);
  }

  editLab(labId: ID): void {
    this.router.navigate(['labs', labId]);
  }

  deleteLab(labId: ID): void {
    this.dialog
      .open(ConfirmDeletionDialogComponent)
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => this.loaded$.next(false)),
        exhaustMap(() => this.labsService.deleteLab(labId)),
        withLatestFrom(this.labs$),
        take(1)
      )
      .subscribe(([{ id }, labs]) => {
        this.labs$.next(labs.filter((lab) => lab.labId !== id));
        this.loaded$.next(true);
      });
    this.labsService.deleteLab(labId);
  }
}
