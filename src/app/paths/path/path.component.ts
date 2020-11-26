import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { PageType } from '../../shared/models/page-type.model';
import { PathsService } from '../paths.service';
import { exists } from '../../shared/utils/exists.util';
import { Path } from '../path.model';
import { ID } from '../../shared/models/id.model';
import { CoursesService } from '../../courses/courses.service';

enum PathFormControlNames {
  name = 'name',
  icon = 'icon',
  courses = 'courses',
}

@Component({
  selector: 'latt-path',
  templateUrl: './path.component.html',
  styles: ['.latt-path {height: 100%;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PathComponent implements OnInit, OnDestroy {
  loaded$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();
  pageType$ = this.activatedRoute.data.pipe(map((data) => data.pageType as PageType));
  courseList$ = this.coursesService.getCourses();

  form: FormGroup<Partial<Path>> = this.fb.group({
    name: [null, Validators.required],
    icon: [null, Validators.required],
    courses: [null],
  });

  pathId: ID;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private pathsService: PathsService,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map((params) => {
          if (!!params.pathId) {
            return params.pathId;
          } else {
            this.loaded$.next(true);
            return null;
          }
        }),
        filter(exists),
        tap((pathId) => (this.pathId = pathId)),
        switchMap((pathId) => this.pathsService.getPath(pathId)),
        takeUntil(this.destroy$)
      )
      .subscribe(({ name, icon, courses }) => {
        this.form.setValue({ name, icon, courses });
        this.loaded$.next(true);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  navigateBack(): void {
    this.router.navigate(['paths']);
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
        const name = this.form.controls[PathFormControlNames.name].value;
        const icon = this.form.controls[PathFormControlNames.icon].value;
        const courses = this.form.controls[PathFormControlNames.courses].value;
        this.pathsService
          .createPath({ name, icon, courses })
          .pipe(take(1))
          .subscribe(() => {
            this.loaded$.next(true);
            this.navigateBack();
          });
      } else {
        const name = this.form.controls[PathFormControlNames.name].value;
        const icon = this.form.controls[PathFormControlNames.icon].value;
        const courses = this.form.controls[PathFormControlNames.courses].value;
        const pathId = this.pathId;
        this.pathsService
          .updatePath({ pathId, name, icon, courses })
          .pipe(take(1))
          .subscribe(() => {
            this.loaded$.next(true);
            this.navigateBack();
          });
      }
    });
  }
}
