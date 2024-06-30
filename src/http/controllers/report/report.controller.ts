import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportService } from 'src/domains/report/report.service';

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('weight-resources-by-planet')
  public async calculateWeightResourcesByPlanet() {
    return await this.reportService.totalWeightResourcesByPlanetReport();
  }

  @Get('percentage-of-resource-type-by-pilot')
  public async calculatePercentageOfResourceTypeByPilot() {
    return await this.reportService.percentageOfResourceTypeByEachPilotReport();
  }
}
