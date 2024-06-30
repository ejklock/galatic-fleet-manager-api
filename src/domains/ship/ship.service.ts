import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { DomainRuleViolationException } from '../common/common.exceptions';
import { ApiPaginatedResponse } from '../common/common.types';
import { PilotCreditTransactionService } from '../pilot-credit-transaction/pilot-credit-transaction.service';
import { PilotShipEntity } from '../pilot-ship/pilot-ship.entity';
import { ShipFuelTransactionService } from '../ship-fuel-transaction/ship-fuel-transaction.service';
import { ShipEntity } from './ship.entity';

@Injectable()
export class ShipService extends BaseService<ShipEntity> {
  constructor(
    @InjectRepository(ShipEntity)
    private readonly shipRepository: Repository<ShipEntity>,
    private readonly pilotCreditTransactionService: PilotCreditTransactionService,
    private readonly shipFuelTransactionService: ShipFuelTransactionService,
  ) {
    super(shipRepository);
  }

  public async validateIfShipsExists(
    ships?: number[],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    this.logger.log('Validate if ships exists');
    if (ships && ships.length !== 0) {
      const existentShips = await this.getRepository(ShipEntity, queryRunner)
        .createQueryBuilder('pilot_ships')
        .where('pilot_ships.id IN (:...ships)', { ships })
        .getMany();
      if (existentShips.length !== ships.length) {
        throw new Error('One or more ships do not exist');
      }
    }
  }

  public async findOneWithCurrentFuelLevel(id: number): Promise<ShipEntity> {
    this.logger.log('Find one with current fuel level');

    return this.shipRepository
      .createQueryBuilder('ship')
      .leftJoin('ship.shipFuelTransactions', 'shipFuelTransactions')
      .addSelect([
        'COALESCE(SUM(shipFuelTransactions.amount),0) AS ship_fuel_level',
      ])
      .groupBy('ship.id')
      .where('ship.id = :id', { id })
      .getOne();
  }

  public async getAllWithCurrentFuelLevelPaginated(
    page = 1,
    limit = 10,
    orderBy = 'id',
    orderWay: 'ASC' | 'DESC' = 'ASC',
  ): Promise<ApiPaginatedResponse<ShipEntity>> {
    this.logger.log('Get all with current fuel level paginated');

    const queryBuilder = this.shipRepository
      .createQueryBuilder('ships')
      .leftJoin('ships.shipFuelTransactions', 'shipFuelTransactions')
      .addSelect([
        'COALESCE(SUM(shipFuelTransactions.amount),0) AS ships_fuel_level',
      ])
      .groupBy('ships.id')
      .orderBy(`ships.${orderBy}`, orderWay)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.buildPaginationResponse(data, total, page, limit);
  }

  public getShipWithFuelLevel(shipId: number, queryRunner?: QueryRunner) {
    this.logger.log('Get ship with fuel level');
    return this.getRepository(ShipEntity, queryRunner)
      .createQueryBuilder('ship')
      .leftJoin('ship.shipFuelTransactions', 'shipFuelTransactions')
      .addSelect([
        'COALESCE(SUM(shipFuelTransactions.amount),0) AS ship_fuel_level',
      ])
      .where({
        id: shipId,
      })
      .getOne();
  }
  protected async getPilotShipWithFuelLevelIfExists(shipId: number) {
    this.logger.log('Validate if ship exists');
    const ship = await this.getEntityManager()
      .getRepository(PilotShipEntity)
      .createQueryBuilder('pilot_ship')
      .leftJoinAndSelect('pilot_ship.ship', 'ship')
      .leftJoin('ship.shipFuelTransactions', 'shipFuelTransactions')
      .addSelect([
        'COALESCE(SUM(shipFuelTransactions.amount),0) AS ship_fuel_level',
      ])
      .where({
        shipId: shipId,
      })
      .getOne();
    if (!ship) {
      throw new Error('Ship not found');
    }
    return ship;
  }
  protected async validateIfShipHasCapacityForFuel(
    ship: ShipEntity,
    fuelQuantity: number,
  ) {
    this.logger.log('Validate if ship has capacity for fuel');

    if (ship.fuelCapacity < fuelQuantity + ship.fuelLevel) {
      throw new DomainRuleViolationException(
        `Ship does not have capacity for this fuel quantity. Current ship level: ${ship.fuelLevel}, ship fuel capacity: ${ship.fuelCapacity}`,
      );
    }
  }

  public async validateShipFuel(
    shipId: number,
    queryRunner?: QueryRunner,
    fuelToBeUsed = 1,
  ): Promise<void> {
    this.logger.log('Validate ship fuel');

    const ship = await this.getShipWithFuelLevel(shipId, queryRunner);

    if (ship.fuelLevel < fuelToBeUsed) {
      throw new DomainRuleViolationException('Ship does not have enough fuel');
    }
  }

  protected async validateIfPilotHasCreditsToTransaction(
    pilotId: number,
    transactionAmount: number,
  ) {
    this.logger.log('Validate if pilot has founds');

    const currentBalance =
      await this.pilotCreditTransactionService.getPilotCurrentBalance(pilotId);

    if (currentBalance < transactionAmount) {
      throw new DomainRuleViolationException(
        'Pilot does not have  sufficient founds',
      );
    }
  }

  public async validateShip(
    shipId: number,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    this.logger.log('Validate ship');

    const ship = await this.getRepository(ShipEntity, queryRunner).findOne({
      where: { id: shipId },
    });
    if (!ship) {
      throw new DomainRuleViolationException('Ship does not exist');
    }
  }

  protected calculateFuelCost(fuelQuantity: number) {
    this.logger.log('Calculate fuel cost');
    return 7 * fuelQuantity;
  }
  public async addFuel(id: number, fuelAmount: number) {
    this.logger.log('Add fuel to ship');

    return await this.executeInTransaction(async (queryRunner: QueryRunner) => {
      const fuelTotalCost = this.calculateFuelCost(fuelAmount);
      const pilotShip = await this.getPilotShipWithFuelLevelIfExists(id);
      await this.validateIfPilotHasCreditsToTransaction(
        pilotShip.pilotId,
        fuelTotalCost,
      );
      await this.validateIfShipHasCapacityForFuel(pilotShip.ship, fuelAmount);
      await this.pilotCreditTransactionService.createPilotDebitTransaction(
        pilotShip.pilotId,
        `ADD FUEL TO SHIP ${pilotShip.shipId}`,
        fuelTotalCost,
        queryRunner,
      );
      await this.shipFuelTransactionService.createShipCreditTransaction(
        pilotShip.shipId,
        `ADD FUEL ${fuelAmount} TO SHIP`,
        fuelAmount,
        queryRunner,
      );
      return true;
    });
  }
}
