import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PathsComponent } from './paths.component';
import { MaterialModule } from '../shared/ui/material.module';
import { LoadingModule } from '../shared/ui/loading/loading.module';
import { ConfirmDeletionDialogModule } from '../shared/ui/confirm-deletion-dialog/confirm-deletion-dialog.module';

const routes: Routes = [
  {
    path: '',
    component: PathsComponent,
    data: { title: 'Paths' },
  },
  {
    path: 'new',
    loadChildren: () => import('./path/path.module').then((m) => m.PathModule),
    data: { pageType: 'Create', title: 'Create Path' },
  },
  {
    path: ':pathId',
    loadChildren: () => import('./path/path.module').then((m) => m.PathModule),
    data: { pageType: 'Edit', title: 'Edit Path' },
  },
];

@NgModule({
  declarations: [PathsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule, LoadingModule, ConfirmDeletionDialogModule],
})
export class PathsModule {}
