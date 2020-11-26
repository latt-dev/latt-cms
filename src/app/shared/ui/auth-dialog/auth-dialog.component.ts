import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { AuthDialogInput, AuthDialogResult } from './auth-dialog.models';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

@Component({
  selector: 'latt-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogComponent {
  isExistingUser$ = new BehaviorSubject<boolean>(false);

  signInForm: FormGroup<AuthDialogResult> = this.fb.group({
    userName: [null, [Validators.required]],
    password: [null, [Validators.required]],
  });

  signUpForm: FormGroup<AuthDialogResult> = this.fb.group({
    userName: [null, [Validators.required]],
    password: [null, [Validators.required]],
    confirmPassword: [null, [Validators.required]],
    code: [null, [Validators.required]],
  });

  constructor(
    public dialogRef: MatDialogRef<AuthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuthDialogInput,
    private fb: FormBuilder
  ) {
    if (this.data.isExistingUser) {
      this.isExistingUser$.next(true);
    }
  }

  switchAuthMode({ index }) {
    if (index === 0) {
      this.isExistingUser$.next(true);
    } else {
      this.isExistingUser$.next(false);
    }
  }

  onConfirm(isExistingUser): void {
    const result = { isExistingUser };
    this.dialogRef.close(
      isExistingUser ? { ...this.signInForm.value, ...result } : { ...this.signUpForm.value, ...result }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
