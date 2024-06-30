import { Test, TestingModule } from '@nestjs/testing';
import { mockRepositoryProviders } from '../common/test/utils';
import { PilotCreditTransactionService } from './pilot-credit-transaction.service';

describe('PilotCreditTransactionService', () => {
  let service: PilotCreditTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PilotCreditTransactionService, ...mockRepositoryProviders],
    }).compile();

    service = module.get<PilotCreditTransactionService>(
      PilotCreditTransactionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
