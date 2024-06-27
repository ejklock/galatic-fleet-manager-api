import { Test, TestingModule } from '@nestjs/testing';
import { PilotShipService } from './pilot-ship.service';

describe('PilotShipService', () => {
  let service: PilotShipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PilotShipService],
    }).compile();

    service = module.get<PilotShipService>(PilotShipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
