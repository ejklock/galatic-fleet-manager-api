import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { ContractEntity } from '../contract/contract.entity';
import { ContractService } from '../contract/contract.service';
import { ContractStatusEnum } from '../contract/contract.types';
import { FederationTransactionLedgerService } from '../federation-transaction-ledger/federation-transaction-ledger.service';
import { PilotCreditTransactionService } from '../pilot-credit-transaction/pilot-credit-transaction.service';
import { PilotService } from '../pilot/pilot.service';
import { ShipFuelTransactionService } from '../ship-fuel-transaction/ship-fuel-transaction.service';
import { ShipService } from '../ship/ship.service';
import { TravelConfigService } from '../travel-config/travel-config.service';
import { TravelEntity } from './travel.entity';

@Injectable()
export class TravelService extends BaseService<TravelEntity> {
  constructor(
    @InjectRepository(TravelEntity) repository: Repository<TravelEntity>,
    private readonly travelConfigService: TravelConfigService,
    private readonly pilotService: PilotService,
    private readonly shipService: ShipService,
    private readonly contractService: ContractService,
    private readonly pilotCreditTransactionService: PilotCreditTransactionService,
    private readonly shipFuelTransactionService: ShipFuelTransactionService,
    private readonly federationTransactionLedgerService: FederationTransactionLedgerService,
  ) {
    super(repository);
  }

  protected async updateShipFuel(
    shipId: number,
    toPlanetId: number,
    fuelConsumption: number,
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('Update ship fuel');

    console.log({ shipId, toPlanetId, fuelConsumption });
    await this.shipFuelTransactionService.createShipDebitTransaction(
      shipId,
      `TRAVEL TO PLANET ${toPlanetId}`,
      fuelConsumption,
      queryRunner,
    );
  }

  protected async creditFundsToPilot(
    contract: ContractEntity,
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('Credit funds to pilot');

    await this.pilotCreditTransactionService.createPilotCreditTransaction(
      contract.pilotId,
      `CONTRACT ${contract.id} COMPLETED`,
      contract.value,
      queryRunner,
    );

    await this.federationTransactionLedgerService.registerTransaction(
      `CONTRACT ${contract.id} paid -${contract.value}`,
    );
  }

  public async store(travel: DeepPartial<TravelEntity>) {
    this.logger.log('Store');

    return await this.executeInTransaction(async (queryRunner: QueryRunner) => {
      const travelConfig = await this.travelConfigService.validateTravelConfig(
        travel.fromPlanetId,
        travel.toPlanetId,
        queryRunner,
      );

      await this.pilotService.validatePilot(travel.pilotId, queryRunner);
      await this.shipService.validateShip(travel.shipId);
      await this.shipService.validateShipFuel(
        travel.shipId,
        queryRunner,
        travelConfig.fuelConsumption,
      );

      if (travel.contractId) {
        const contract =
          await this.contractService.validateIfContractIsAccepted(
            travel.contractId,
            queryRunner,
          );

        await this.creditFundsToPilot(contract, queryRunner);

        await queryRunner.manager
          .getRepository(ContractEntity)
          .update(travel.contractId, {
            status: ContractStatusEnum.COMPLETED,
          });
      }

      await this.updateShipFuel(
        travel.shipId,
        travel.toPlanetId,
        travelConfig.fuelConsumption,
        queryRunner,
      );

      const createdTravel = await queryRunner.manager.save(TravelEntity, {
        ...travel,
        fuelConsumed: travelConfig.fuelConsumption,
      });
      return createdTravel;
    });
  }
}
