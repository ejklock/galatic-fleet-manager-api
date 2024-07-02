import { Module } from '@nestjs/common';
import { FederationTransactionLedgerModule } from '../federation-transaction-ledger/federation-transaction-ledger.module';
import { PilotModule } from '../pilot/pilot.module';
import { PlanetModule } from '../planet/planet.module';
import { ReportService } from './report.service';

@Module({
  imports: [PlanetModule, PilotModule, FederationTransactionLedgerModule],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
