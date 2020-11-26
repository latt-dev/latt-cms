import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { PageType } from '../../shared/models/page-type.model';
import { CoursesService } from '../courses.service';
import { exists } from '../../shared/utils/exists.util';
import { ID } from '../../shared/models/id.model';
import { Course } from '../course.model';
import { Lab } from '../../labs/lab.model';
import { Article } from '../../articles/article.model';
import { Question } from '../../questions/question.model';

enum CourseFormControlNames {
  name = 'name',
  icon = 'icon',
  objective = 'objective',
}

@Component({
  selector: 'latt-course',
  templateUrl: './course.component.html',
  styles: ['.latt-course {height: 100%;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit, OnDestroy {
  loaded$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();
  pageType$ = this.activatedRoute.data.pipe(map((data) => data.pageType as PageType));

  form: FormGroup<Partial<Course>> = this.fb.group({
    name: [null, Validators.required],
    icon: [null, Validators.required],
    objective: [null, Validators.required],
  });

  /** @todo get rid of both? */
  courseId: ID;
  courseQuestions: Question[];
  courseArticles: Article[];
  courseLabs: Lab[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        map((params) => {
          if (!!params.courseId) {
            return params.courseId;
          } else {
            this.loaded$.next(true);
            return null;
          }
        }),
        filter(exists),
        tap((pathId) => (this.courseId = pathId)),
        switchMap((courseId) => this.coursesService.getCourse(courseId)),
        takeUntil(this.destroy$)
      )
      .subscribe(({ name, icon, objective, questions, articles, labs }) => {
        this.courseQuestions = questions;
        this.courseArticles = articles;
        this.courseLabs = labs;
        this.form.setValue({ name, icon, objective });
        this.loaded$.next(true);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  navigateBack(): void {
    this.router.navigate(['courses']);
  }

  cancel(): void {
    this.navigateBack();
  }

  save(): void {
    this.loaded$.next(false);
    this.pageType$.pipe(takeUntil(this.destroy$)).subscribe((pageType) => {
      if (pageType === 'Create') {
        const name = this.form.controls[CourseFormControlNames.name].value;
        const icon = this.form.controls[CourseFormControlNames.icon].value;
        const objective = this.form.controls[CourseFormControlNames.objective].value;
        const questions = [];
        const articles = [];
        const labs = [];
        this.coursesService
          .createCourse({ name, icon, objective, questions, articles, labs })
          .pipe(take(1))
          .subscribe(() => {
            this.loaded$.next(true);
            this.navigateBack();
          });
      } else {
        const name = this.form.controls[CourseFormControlNames.name].value;
        const icon = this.form.controls[CourseFormControlNames.icon].value;
        const objective = this.form.controls[CourseFormControlNames.objective].value;
        const questions = this.courseQuestions;
        const articles = this.courseArticles;
        const labs = this.courseLabs;
        const courseId = this.courseId;
        this.coursesService
          .updateCourse({ courseId, name, icon, objective, questions, articles, labs })
          .pipe(take(1))
          .subscribe(() => {
            this.loaded$.next(true);
            this.navigateBack();
          });
      }
    });
  }
}
