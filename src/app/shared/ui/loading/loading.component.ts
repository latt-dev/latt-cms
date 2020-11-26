import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'latt-loading',
  templateUrl: './loading.component.html',
  styles: ['.latt-loading { height: calc(100% - 64px); }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {}
