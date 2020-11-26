import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PathsService } from './paths.service';

describe('PathsService', () => {
  let service: PathsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PathsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
