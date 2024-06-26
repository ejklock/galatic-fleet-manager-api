import { Test, TestingModule } from '@nestjs/testing';
import { TravelConfigService } from './travel-config.service';

describe('TravelConfigService', () => {
  let service: TravelConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelConfigService],
    }).compile();

    service = module.get<TravelConfigService>(TravelConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
