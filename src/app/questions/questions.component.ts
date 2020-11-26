import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { exhaustMap, filter, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { Question } from './question.model';
import { QuestionsService } from './questions.service';
import { ID } from '../shared/models/id.model';
import { ConfirmDeletionDialogComponent } from '../shared/ui/confirm-deletion-dialog/confirm-deletion-dialog.component';

@Component({
  selector: 'latt-questions',
  templateUrl: './questions.component.html',
  styles: [
    '.latt-questions {height: 100%;}',
    'li:not(:last-child) { padding-bottom: 8px; }',
    '.question-text { margin-right: 8px; }',
    '.add-question-fab { position: absolute; bottom: 16px; right: 16px; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsComponent implements OnInit, OnDestroy {
  questions$ = new BehaviorSubject<Question[]>([]);
  loaded$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();

  constructor(private questionsService: QuestionsService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.questionsService
      .getQuestions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((questions) => {
        this.questions$.next(questions);
        this.loaded$.next(true);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  createQuestion(): void {
    this.router.navigate(['questions', 'new']);
  }

  editQuestion(questionId: ID): void {
    this.router.navigate(['questions', questionId]);
  }

  deleteQuestion(questionId: ID): void {
    this.dialog
      .open(ConfirmDeletionDialogComponent)
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => this.loaded$.next(false)),
        exhaustMap(() => this.questionsService.deleteQuestion(questionId)),
        withLatestFrom(this.questions$),
        take(1)
      )
      .subscribe(([{ id }, questions]) => {
        this.questions$.next(questions.filter((question) => question.questionId !== id));
        this.loaded$.next(true);
      });
    this.questionsService.deleteQuestion(questionId);
  }
}
