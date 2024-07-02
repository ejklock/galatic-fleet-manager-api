import { Injectable } from '@nestjs/common';
import { FederationTransactionLedgerService } from '../federation-transaction-ledger/federation-transaction-ledger.service';
import { PilotService } from '../pilot/pilot.service';
import { PlanetService } from '../planet/planet.service';

@Injectable()
export class ReportService {
  public constructor(
    private readonly planetService: PlanetService,
    private readonly pilotService: PilotService,
    private readonly federationTransactionLedgerService: FederationTransactionLedgerService,
  ) {}
  public async totalWeightResourcesByPlanetReport() {
    const rawReport = await this.planetService.repository
      .createQueryBuilder('planet')
      .leftJoin(
        'contracts',
        'c',
        'c.originPlanetId = planet.id OR c.destinationPlanetId = planet.id',
      )
      .leftJoin('contract_resources', 'cr', 'cr.contractId = c.id')
      .leftJoin('resources', 'r', 'r.id = cr.resourceId')
      .select('planet.name', 'planet')
      .addSelect('r.type', 'resource')
      .addSelect(
        'SUM(CASE WHEN c.originPlanetId = planet.id THEN cr.quantity * r.weight ELSE 0 END)',
        'total_sent',
      )
      .addSelect(
        'SUM(CASE WHEN c.destinationPlanetId = planet.id THEN cr.quantity * r.weight ELSE 0 END)',
        'total_received',
      )
      .groupBy('planet.name, r.type')
      .getRawMany();

    const formattedReport = rawReport.reduce((acc, row) => {
      const planet = row.planet;
      const resource = row.resource?.toLowerCase();

      if (!acc[planet]) {
        acc[planet] = {
          sent: {},
          received: {},
        };
      }
      if (resource !== undefined) {
        acc[planet].sent[resource] =
          (acc[planet].sent[resource] || 0) + parseFloat(row.total_sent);
        acc[planet].received[resource] =
          (acc[planet].received[resource] || 0) +
          parseFloat(row.total_received);
      } else {
        acc[planet].sent = 0;
        acc[planet].received = 0;
      }

      return acc;
    }, {});

    return formattedReport;
  }

  public async percentageOfResourceTypeByEachPilotReport() {
    const rawReport = await this.pilotService.repository
      .createQueryBuilder('pilot')
      .leftJoin('contracts', 'c', 'c.pilotId = pilot.id')
      .leftJoin('contract_resources', 'cr', 'cr.contractId = c.id')
      .leftJoin('resources', 'r', 'r.id = cr.resourceId')
      .select('pilot.name', 'pilot')
      .addSelect('r.type', 'resource')
      .addSelect('SUM(cr.quantity * r.weight)', 'total_weight')
      .groupBy('pilot.name, r.type')
      .getRawMany();

    const totalWeightsByPilot = await this.pilotService.repository
      .createQueryBuilder('pilot')
      .leftJoin('contracts', 'c', 'c.pilotId = pilot.id')
      .leftJoin('contract_resources', 'cr', 'cr.contractId = c.id')
      .leftJoin('resources', 'r', 'r.id = cr.resourceId')
      .select('pilot.name', 'pilot')
      .addSelect('SUM(cr.quantity * r.weight)', 'total_weight')
      .groupBy('pilot.name')
      .getRawMany();

    const totalWeightsMap = totalWeightsByPilot.reduce((acc, row) => {
      acc[row.pilot] = parseFloat(row.total_weight);
      return acc;
    }, {});

    const formattedReport = rawReport.reduce((acc, row) => {
      const pilot = row.pilot;
      const resource = row.resource;

      if (!acc[pilot]) {
        acc[pilot] = {};
      }
      const totalWeight = totalWeightsMap[pilot];
      const percentage = (parseFloat(row.total_weight) / totalWeight) * 100;

      acc[pilot][resource?.toLowerCase()] = Number(percentage.toFixed(2)) || 0;

      return acc;
    }, {});

    return formattedReport;
  }

  public async federationTransactionReport() {
    const unformattedReport =
      await this.federationTransactionLedgerService.repository.find({
        order: {
          createdAt: 'ASC',
        },
      });

    const formattedReport = unformattedReport.map((row) => {
      return row.description;
    });

    return formattedReport;
  }
}
