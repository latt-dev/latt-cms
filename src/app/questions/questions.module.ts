import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { QuestionsComponent } from './questions.component';
import { MaterialModule } from '../shared/ui/material.module';
import { LoadingModule } from '../shared/ui/loading/loading.module';
import { ConfirmDeletionDialogModule } from '../shared/ui/confirm-deletion-dialog/confirm-deletion-dialog.module';

const routes: Routes = [
  {
    path: '',
    component: QuestionsComponent,
    data: { title: 'Questions' },
  },
  {
    path: 'new',
    loadChildren: () => import('./question/question.module').then((m) => m.QuestionModule),
    data: { pageType: 'Create', title: 'Create Question' },
  },
  {
    path: ':questionId',
    loadChildren: () => import('./question/question.module').then((m) => m.QuestionModule),
    data: { pageType: 'Edit', title: 'Edit Question' },
  },
];

@NgModule({
  declarations: [QuestionsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule, LoadingModule, ConfirmDeletionDialogModule],
})
export class QuestionsModule {}
