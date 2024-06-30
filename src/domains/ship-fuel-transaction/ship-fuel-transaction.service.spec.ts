import { Test, TestingModule } from '@nestjs/testing';
import { ShipFuelTransactionService } from './ship-fuel-transaction.service';

describe('ShipFuelTransactionService', () => {
  let service: ShipFuelTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipFuelTransactionService],
    }).compile();

    service = module.get<ShipFuelTransactionService>(ShipFuelTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
