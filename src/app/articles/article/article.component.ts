import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { PageType } from '../../shared/models/page-type.model';
import { Article } from '../article.model';
import { ID } from '../../shared/models/id.model';
import { ArticlesService } from '../articles.service';
import { CoursesService } from '../../courses/courses.service';
import { exists } from '../../shared/utils/exists.util';

enum ArticleFormControlNames {
  name = 'name',
  description = 'description',
  duration = 'duration',
  url = 'url',
  course = 'course',
}

@Component({
  selector: 'latt-article',
  templateUrl: './article.component.html',
  styles: ['.latt-article {height: 100%;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent implements OnInit, OnDestroy {
  loaded$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();
  pageType$ = this.activatedRoute.data.pipe(map((data) => data.pageType as PageType));
  courseList$ = this.coursesService.getCourses();

  form: FormGroup<Partial<Article>> = this.fb.group({
    name: [null, Validators.required],
    description: [null],
    duration: [null, Validators.required],
    url: [null, Validators.required],
    course: [null],
  });

  articleId: ID;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private articlesService: ArticlesService,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map((params) => {
          if (!!params.articleId) {
            return params.articleId;
          } else {
            this.loaded$.next(true);
            return null;
          }
        }),
        filter(exists),
        tap((articleId) => (this.articleId = articleId)),
        switchMap((articleId) => this.articlesService.getArticle(articleId)),
        takeUntil(this.destroy$)
      )
      .subscribe(({ name, description, duration, url, course }) => {
        this.form.setValue({ name, description, duration, url, course });
        this.loaded$.next(true);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  navigateBack(): void {
    this.router.navigate(['articles']);
  }

  cancel(): void {
    this.navigateBack();
  }

  courseItemCompareFn(course1, course2) {
    if (course1.courseId === course2.courseId) {
      return course1.name;
    } else {
      return '';
    }
  }

  save(): void {
    this.loaded$.next(false);
    this.pageType$.pipe(takeUntil(this.destroy$)).subscribe((pageType) => {
      if (pageType === 'Create') {
        const name = this.form.controls[ArticleFormControlNames.name].value;
        const description = this.form.controls[ArticleFormControlNames.description].value;
        const duration = this.form.controls[ArticleFormControlNames.duration].value;
        const url = this.form.controls[ArticleFormControlNames.url].value;
        const course = this.form.controls[ArticleFormControlNames.course].value;
        this.articlesService
          .createArticle({ name, description, duration, url, course })
          .pipe(take(1))
          .subscribe(() => {
            this.loaded$.next(true);
            this.navigateBack();
          });
      } else {
        const name = this.form.controls[ArticleFormControlNames.name].value;
        const description = this.form.controls[ArticleFormControlNames.description].value;
        const duration = this.form.controls[ArticleFormControlNames.duration].value;
        const url = this.form.controls[ArticleFormControlNames.url].value;
        const course = this.form.controls[ArticleFormControlNames.course].value;
        const articleId = this.articleId;
        this.articlesService
          .updateArticle({ articleId, name, description, url, duration, course })
          .pipe(take(1))
          .subscribe(() => {
            this.loaded$.next(true);
            this.navigateBack();
          });
      }
    });
  }
}
