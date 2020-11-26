import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmDeletionDialogComponent } from './confirm-deletion-dialog.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [ConfirmDeletionDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ConfirmDeletionDialogComponent],
})
export class ConfirmDeletionDialogModule {}
