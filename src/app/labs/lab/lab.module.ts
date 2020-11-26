import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LabComponent } from './lab.component';
import { MaterialModule } from '../../shared/ui/material.module';
import { LoadingModule } from '../../shared/ui/loading/loading.module';

const routes: Routes = [
  {
    path: '',
    component: LabComponent,
  },
];

@NgModule({
  declarations: [LabComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule, ReactiveFormsModule, LoadingModule],
})
export class LabModule {}
