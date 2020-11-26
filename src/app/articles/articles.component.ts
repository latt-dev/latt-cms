import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { exhaustMap, filter, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { Article } from './article.model';
import { ArticlesService } from './articles.service';
import { ID } from '../shared/models/id.model';
import { ConfirmDeletionDialogComponent } from '../shared/ui/confirm-deletion-dialog/confirm-deletion-dialog.component';

@Component({
  selector: 'latt-articles',
  templateUrl: './articles.component.html',
  styles: [
    '.latt-articles {height: 100%;}',
    'li:not(:last-child) { padding-bottom: 8px; }',
    '.article-name { margin-right: 8px; }',
    '.add-article-fab { position: absolute; bottom: 16px; right: 16px; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent implements OnInit, OnDestroy {
  articles$ = new BehaviorSubject<Article[]>([]);
  loaded$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();

  constructor(private articlesService: ArticlesService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.articlesService
      .getArticles()
      .pipe(takeUntil(this.destroy$))
      .subscribe((articles) => {
        this.articles$.next(articles);
        this.loaded$.next(true);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  createArticle(): void {
    this.router.navigate(['articles', 'new']);
  }

  editArticle(articleId: ID): void {
    this.router.navigate(['articles', articleId]);
  }

  deleteArticle(articleId: ID): void {
    this.dialog
      .open(ConfirmDeletionDialogComponent)
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => this.loaded$.next(false)),
        exhaustMap(() => this.articlesService.deleteArticle(articleId)),
        withLatestFrom(this.articles$),
        take(1)
      )
      .subscribe(([{ id }, articles]) => {
        this.articles$.next(articles.filter((article) => article.articleId !== id));
        this.loaded$.next(true);
      });
    this.articlesService.deleteArticle(articleId);
  }
}
