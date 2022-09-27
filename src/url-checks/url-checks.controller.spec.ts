import { Test, TestingModule } from '@nestjs/testing';
import { UrlChecksController } from './url-checks.controller';
import { UrlChecksService } from './url-checks.service';

describe('UrlChecksController', () => {
  let controller: UrlChecksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlChecksController],
      providers: [UrlChecksService],
    }).compile();

    controller = module.get<UrlChecksController>(UrlChecksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
