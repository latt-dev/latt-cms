import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { QuestionComponent } from './question.component';
import { MaterialModule } from '../../shared/ui/material.module';
import { LoadingModule } from '../../shared/ui/loading/loading.module';

const routes: Routes = [
  {
    path: '',
    component: QuestionComponent,
  },
];

@NgModule({
  declarations: [QuestionComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule, ReactiveFormsModule, LoadingModule],
})
export class QuestionModule {}
