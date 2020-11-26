import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PathsComponent } from './paths.component';
import { PathsService } from './paths.service';
import { MaterialModule } from '../shared/ui/material.module';

describe('PathsComponent', () => {
  let component: PathsComponent;
  let fixture: ComponentFixture<PathsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule],
      providers: [PathsService],
      declarations: [PathsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
