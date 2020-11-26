import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthDialogComponent } from './auth-dialog.component';
import { MaterialModule } from '../material.module';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
  declarations: [AuthDialogComponent],
  exports: [AuthDialogComponent],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, ReactiveComponentModule],
})
export class AuthDialogModule {}
