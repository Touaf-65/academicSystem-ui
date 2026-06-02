import { TestBed } from '@angular/core/testing';

import { EcheanceService } from './echeance.service';

describe('EcheanceService', () => {
  let service: EcheanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcheanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
