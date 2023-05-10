import { TestBed } from '@angular/core/testing';

import { DevTypeService } from './dev-type.service';

describe('DevTypeService', () => {
  let service: DevTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
