import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { exhaustMap, filter, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { CoursesService } from './courses.service';
import { Course } from './course.model';
import { ID } from '../shared/models/id.model';
import { ConfirmDeletionDialogComponent } from '../shared/ui/confirm-deletion-dialog/confirm-deletion-dialog.component';

@Component({
  selector: 'latt-courses',
  templateUrl: `./courses.component.html`,
  styles: [
    '.latt-courses {height: 100%;}',
    'li:not(:last-child) { padding-bottom: 8px; }',
    '.course-logo { height: 48px; margin-right: 8px; }',
    '.course-name { margin-right: 8px; }',
    '.add-course-fab { position: absolute; bottom: 16px; right: 16px; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses$ = new BehaviorSubject<Course[]>([]);
  loaded$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();

  constructor(private coursesService: CoursesService, private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    this.coursesService
      .getCourses()
      .pipe(takeUntil(this.destroy$))
      .subscribe((courses) => {
        this.courses$.next(courses);
        this.loaded$.next(true);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  createCourse(): void {
    this.router.navigate(['courses', 'new']);
  }

  editCourse(courseId: ID): void {
    this.router.navigate(['courses', courseId]);
  }

  deleteCourse(courseId: ID): void {
    this.dialog
      .open(ConfirmDeletionDialogComponent)
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => this.loaded$.next(false)),
        exhaustMap(() => this.coursesService.deleteCourse(courseId)),
        withLatestFrom(this.courses$),
        take(1)
      )
      .subscribe(([{ id }, courses]) => {
        this.courses$.next(courses.filter((course) => course.courseId !== id));
        this.loaded$.next(true);
      });
  }
}
