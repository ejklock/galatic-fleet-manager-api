import { Module } from '@nestjs/common';
import { PilotModule } from '../pilot/pilot.module';
import { PlanetModule } from '../planet/planet.module';
import { ReportService } from './report.service';

@Module({
  imports: [PlanetModule, PilotModule],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
