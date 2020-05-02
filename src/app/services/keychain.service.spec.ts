import { TestBed } from '@angular/core/testing';

import { KeychainService } from './keychain.service';

describe('KeychainService', () => {
  let service: KeychainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeychainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
