import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersComponent } from './users.component';
import { MaterialModule } from '../shared/ui/material.module';
import { LoadingModule } from '../shared/ui/loading/loading.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    data: { title: 'Users' },
  },
];

@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, MaterialModule, LoadingModule, RouterModule.forChild(routes)],
  exports: [UsersComponent],
})
export class UsersModule {}
