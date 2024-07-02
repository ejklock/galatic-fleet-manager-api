import { Test } from '@nestjs/testing';
import { mockRepositoryProviders } from '../common/test/utils';
import { FederationTransactionLedgerService } from '../federation-transaction-ledger/federation-transaction-ledger.service';
import { PilotCreditTransactionService } from '../pilot-credit-transaction/pilot-credit-transaction.service';
import { ShipFuelTransactionService } from '../ship-fuel-transaction/ship-fuel-transaction.service';
import { ShipService } from './ship.service';

describe('ShipService', () => {
  let shipService: ShipService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        ShipService,
        PilotCreditTransactionService,
        ShipFuelTransactionService,
        FederationTransactionLedgerService,
        ...mockRepositoryProviders,
      ], // Add
    }).compile();

    shipService = moduleRef.get<ShipService>(ShipService);
  });

  it('should be defined', () => {
    expect(shipService).toBeDefined();
  });
});
