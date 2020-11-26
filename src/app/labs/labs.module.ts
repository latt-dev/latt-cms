import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LabsComponent } from './labs.component';
import { MaterialModule } from '../shared/ui/material.module';
import { LoadingModule } from '../shared/ui/loading/loading.module';
import { ConfirmDeletionDialogModule } from '../shared/ui/confirm-deletion-dialog/confirm-deletion-dialog.module';

const routes: Routes = [
  {
    path: '',
    component: LabsComponent,
    data: { title: 'Labs' },
  },
  {
    path: 'new',
    loadChildren: () => import('./lab/lab.module').then((m) => m.LabModule),
    data: { pageType: 'Create', title: 'Create Lab' },
  },
  {
    path: ':labId',
    loadChildren: () => import('./lab/lab.module').then((m) => m.LabModule),
    data: { pageType: 'Edit', title: 'Edit Lab' },
  },
];

@NgModule({
  declarations: [LabsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule, LoadingModule, ConfirmDeletionDialogModule],
})
export class LabsModule {}
