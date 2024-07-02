import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockRepositoryProviders } from '../common/test/utils';
import { FederationTransactionLedgerEntity } from './federation-transaction-ledger.entity';
import { FederationTransactionLedgerService } from './federation-transaction-ledger.service';

describe('FederationTransactionLedgerService', () => {
  let service: FederationTransactionLedgerService;
  let repository: Repository<FederationTransactionLedgerEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FederationTransactionLedgerService,
        ...mockRepositoryProviders,
      ],
    }).compile();

    service = module.get<FederationTransactionLedgerService>(
      FederationTransactionLedgerService,
    );
    repository = module.get<Repository<FederationTransactionLedgerEntity>>(
      getRepositoryToken(FederationTransactionLedgerEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerTransaction', () => {
    it('should save a transaction', async () => {
      const saveSpy = jest
        .spyOn(service, 'registerTransaction')
        .mockResolvedValue({} as any);

      const description = 'Test Transaction';
      await service.registerTransaction(description);

      expect(saveSpy).toHaveBeenCalledWith(description);
    });
  });
});
