import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { PageType } from '../../shared/models/page-type.model';
import { OptionId, Question, QuestionOption } from '../question.model';
import { QuestionsService } from '../questions.service';
import { ID } from '../../shared/models/id.model';
import { CoursesService } from '../../courses/courses.service';
import { exists } from '../../shared/utils/exists.util';

enum QuestionFormControlNames {
  text = 'text',
  options = 'options',
  answer = 'answer',
  course = 'course',
}

@Component({
  selector: 'latt-question',
  templateUrl: './question.component.html',
  styles: ['.latt-question {height: 100%;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent implements OnInit, OnDestroy {
  loaded$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();
  pageType$ = this.activatedRoute.data.pipe(map((data) => data.pageType as PageType));
  courseList$ = this.coursesService.getCourses();

  form: FormGroup<Partial<Question>> = this.fb.group({
    text: [null, Validators.required],
    options: [null, Validators.required],
    answer: [null, Validators.required],
    course: [null, Validators.required],
  });

  questionId: ID;
  optionIds = Object.values(OptionId).filter((value) => typeof value === 'string');

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private questionsService: QuestionsService,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        map((params) => {
          if (!!params.questionId) {
            return params.questionId;
          } else {
            this.setupFormData();
            return null;
          }
        }),
        filter(exists),
        tap((questionId) => (this.questionId = questionId)),
        switchMap((questionId) => this.questionsService.getQuestion(questionId)),
        takeUntil(this.destroy$)
      )
      .subscribe((question) => {
        this.setupFormData(question);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  get options(): FormArray<Partial<QuestionOption>> {
    return this.form.get('options') as FormArray;
  }

  buildOptions(options: QuestionOption[] = []): FormArray {
    return this.fb.array(options.map((option) => this.fb.group(option)));
  }

  getNewOptionId() {
    const currentLength = this.options.length;
    return this.optionIds[currentLength];
  }

  addOption() {
    this.options.push(this.fb.group({ text: null, optionId: this.getNewOptionId() }));
  }

  removeOption(index: number): void {
    if (this.options.length > 1) {
      this.options.removeAt(index);
    } else {
      this.options.patchValue([{ text: null, optionId: OptionId.A }]);
    }
  }

  setupFormData(question?: Question) {
    if (!question) {
      const options = this.buildOptions([{ text: null, optionId: OptionId.A }]);
      this.form = this.fb.group({ text: null, options, answer: null, course: null });
      this.loaded$.next(true);
    } else {
      const { text, answer, course } = question;
      const options = this.buildOptions(question.options);
      this.form = this.fb.group({ text, options, answer, course });
      this.loaded$.next(true);
    }
  }

  navigateBack(): void {
    this.router.navigate(['questions']);
  }

  cancel(): void {
    this.navigateBack();
  }

  save(): void {
    this.loaded$.next(false);
    this.pageType$.pipe(takeUntil(this.destroy$)).subscribe((pageType) => {
      if (pageType === 'Create') {
        const text = this.form.controls[QuestionFormControlNames.text].value;
        const options = this.form.controls[QuestionFormControlNames.options].value;
        const answer = this.form.controls[QuestionFormControlNames.answer].value;
        const course = this.form.controls[QuestionFormControlNames.course].value;
        this.questionsService
          .createQuestion({ text, options, answer, course })
          .pipe(take(1))
          .subscribe(() => {
            this.loaded$.next(true);
            this.navigateBack();
          });
      } else {
        const text = this.form.controls[QuestionFormControlNames.text].value;
        const options = this.form.controls[QuestionFormControlNames.options].value;
        const answer = this.form.controls[QuestionFormControlNames.answer].value;
        const course = this.form.controls[QuestionFormControlNames.course].value;
        const questionId = this.questionId;
        this.questionsService
          .updateQuestion({ text, options, answer, course, questionId })
          .pipe(take(1))
          .subscribe(() => {
            this.loaded$.next(true);
            this.navigateBack();
          });
      }
    });
  }

  courseItemCompareFn(course1, course2) {
    if (course1?.courseId === course2?.courseId) {
      return course1.name;
    } else {
      return '';
    }
  }
}
