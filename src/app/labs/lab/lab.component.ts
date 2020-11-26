import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { PageType } from '../../shared/models/page-type.model';
import { Lab } from '../lab.model';
import { ID } from '../../shared/models/id.model';
import { LabsService } from '../labs.service';
import { CoursesService } from '../../courses/courses.service';
import { exists } from '../../shared/utils/exists.util';

enum LabFormControlNames {
  name = 'name',
  description = 'description',
  duration = 'duration',
  url = 'url',
  course = 'course',
}

@Component({
  selector: 'latt-lab',
  templateUrl: './lab.component.html',
  styles: ['.latt-lab {height: 100%;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabComponent implements OnInit, OnDestroy {
  loaded$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();
  pageType$ = this.activatedRoute.data.pipe(map((data) => data.pageType as PageType));
  courseList$ = this.coursesService.getCourses();

  form: FormGroup<Partial<Lab>> = this.fb.group({
    name: [null, Validators.required],
    description: [null],
    duration: [null, Validators.required],
    url: [null, Validators.required],
    course: [null],
  });

  labId: ID;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private labsService: LabsService,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map((params) => {
          if (!!params.labId) {
            return params.labId;
          } else {
            this.loaded$.next(true);
            return null;
          }
        }),
        filter(exists),
        tap((labId) => (this.labId = labId)),
        switchMap((labId) => this.labsService.getLab(labId)),
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
    this.router.navigate(['labs']);
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
        const name = this.form.controls[LabFormControlNames.name].value;
        const description = this.form.controls[LabFormControlNames.description].value;
        const duration = this.form.controls[LabFormControlNames.duration].value;
        const url = this.form.controls[LabFormControlNames.url].value;
        const course = this.form.controls[LabFormControlNames.course].value;
        this.labsService
          .createLab({ name, description, duration, url, course })
          .pipe(take(1))
          .subscribe(() => {
            this.loaded$.next(true);
            this.navigateBack();
          });
      } else {
        const name = this.form.controls[LabFormControlNames.name].value;
        const description = this.form.controls[LabFormControlNames.description].value;
        const duration = this.form.controls[LabFormControlNames.duration].value;
        const url = this.form.controls[LabFormControlNames.url].value;
        const course = this.form.controls[LabFormControlNames.course].value;
        const labId = this.labId;
        this.labsService
          .updateLab({ labId, name, description, url, duration, course })
          .pipe(take(1))
          .subscribe(() => {
            this.loaded$.next(true);
            this.navigateBack();
          });
      }
    });
  }
}
