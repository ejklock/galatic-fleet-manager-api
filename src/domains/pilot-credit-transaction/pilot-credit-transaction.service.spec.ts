import { Test, TestingModule } from '@nestjs/testing';
import { PilotCreditTransactionService } from './pilot-credit-transaction.service';

describe('PilotCreditTransactionService', () => {
  let service: PilotCreditTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PilotCreditTransactionService],
    }).compile();

    service = module.get<PilotCreditTransactionService>(PilotCreditTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
