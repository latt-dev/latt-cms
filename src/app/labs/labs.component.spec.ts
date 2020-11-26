import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LabsComponent } from './labs.component';
import { MaterialModule } from '../shared/ui/material.module';
import { LabsService } from './labs.service';

describe('LabsComponent', () => {
  let component: LabsComponent;
  let fixture: ComponentFixture<LabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule],
      providers: [LabsService],
      declarations: [LabsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
