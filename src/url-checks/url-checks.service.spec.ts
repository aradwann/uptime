import { Test, TestingModule } from '@nestjs/testing';
import { UrlChecksService } from './url-checks.service';

describe('UrlChecksService', () => {
  let service: UrlChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlChecksService],
    }).compile();

    service = module.get<UrlChecksService>(UrlChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
