import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'latt-confirm-deletion-dialog',
  template: `
    <div class="confirm-deletion-dialog" fxLayout="column" fxLayoutAlign="start center">
      <h1 mat-dialog-title>Are you sure?</h1>
      <mat-dialog-content class="mat-typography">
        <p>You won't be able to undo the action!</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Confirm</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeletionDialogComponent {}
