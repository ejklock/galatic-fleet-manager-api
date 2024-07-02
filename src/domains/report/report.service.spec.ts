import { Test, TestingModule } from '@nestjs/testing';
import { mockRepositoryProviders } from '../common/test/utils';
import { FederationTransactionLedgerService } from '../federation-transaction-ledger/federation-transaction-ledger.service';
import { PilotCreditTransactionService } from '../pilot-credit-transaction/pilot-credit-transaction.service';
import { PilotShipService } from '../pilot-ship/pilot-ship.service';
import { PilotService } from '../pilot/pilot.service';
import { PlanetService } from '../planet/planet.service';
import { ShipFuelTransactionService } from '../ship-fuel-transaction/ship-fuel-transaction.service';
import { ShipService } from '../ship/ship.service';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        PlanetService,
        ShipService,
        PilotCreditTransactionService,
        FederationTransactionLedgerService,
        ShipFuelTransactionService,
        PilotShipService,
        PilotService,
        ...mockRepositoryProviders,
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
