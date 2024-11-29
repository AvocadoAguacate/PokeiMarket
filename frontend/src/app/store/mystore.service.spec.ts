import { TestBed } from '@angular/core/testing';

import { MystoreService } from './mystore.service';

describe('MystoreService', () => {
  let service: MystoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MystoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
