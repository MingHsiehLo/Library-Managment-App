import { TestBed } from '@angular/core/testing';

import { HomeResolverService } from './home-resolver.service';

describe('HomeResolverServiceService', () => {
  let service: HomeResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
