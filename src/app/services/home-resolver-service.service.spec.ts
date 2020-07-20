import { TestBed } from '@angular/core/testing';

import { HomeResolverService } from './home-resolver.service';

describe('HomeResolverServiceService', () => {
  let service: HomeResolverServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeResolverServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
