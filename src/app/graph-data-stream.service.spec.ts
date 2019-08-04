import { TestBed } from '@angular/core/testing';

import { GraphDataStreamService } from './graph-data-stream.service';

describe('GraphDataStreamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphDataStreamService = TestBed.get(GraphDataStreamService);
    expect(service).toBeTruthy();
  });
});
