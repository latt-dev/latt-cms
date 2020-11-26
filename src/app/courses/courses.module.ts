import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoursesComponent } from './courses.component';
import { MaterialModule } from '../shared/ui/material.module';
import { LoadingModule } from '../shared/ui/loading/loading.module';
import { ConfirmDeletionDialogModule } from '../shared/ui/confirm-deletion-dialog/confirm-deletion-dialog.module';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
    data: { title: 'Courses' },
  },
  {
    path: 'new',
    loadChildren: () => import('./course/course.module').then((m) => m.CourseModule),
    data: { pageType: 'Create', title: 'Create Course' },
  },
  {
    path: ':courseId',
    loadChildren: () => import('./course/course.module').then((m) => m.CourseModule),
    data: { pageType: 'Edit', title: 'Edit Course' },
  },
];

@NgModule({
  declarations: [CoursesComponent],
  imports: [CommonModule, MaterialModule, LoadingModule, RouterModule.forChild(routes), ConfirmDeletionDialogModule],
  exports: [CoursesComponent],
})
export class CoursesModule {}
