import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource, DataSourceOptions } from 'typeorm';

import { AppModule } from '../src/app.module';
import { mysqlConfig } from '../src/config/db-mysql.config';

async function runMigrations() {
  const dataSource = new DataSource(mysqlConfig as DataSourceOptions);

  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized.');

    await dataSource.runMigrations();
    console.log('Migrations have been run.');
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
  }

  return dataSource;
}

describe('Ships and Pilot (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let pilotId: number;
  let contract;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dataSource = await runMigrations();
    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    await app.init();
  });

  it('should create 3 ships and a pilot', async () => {
    const pilotResponse = await request(app.getHttpServer())
      .post('/api/v1/pilots')
      .send({
        name: 'John Doe',
        age: 30,
        locationPlanetId: 1,
        certification: '1234567',
      })
      .expect(201);

    pilotId = pilotResponse.body.data.id;

    const shipPromises = [];
    for (let i = 1; i <= 3; i++) {
      shipPromises.push(
        request(app.getHttpServer())
          .post('/api/v1/ships')
          .send({
            fuelCapacity: 10 + i * 2,
            fuelLevel: 10 + i * 2,
            weightCapacity: 20 + i * 3,
            pilotId,
          })
          .expect(201),
      );
    }

    await Promise.all(shipPromises);

    const shipsResponse = await request(app.getHttpServer())
      .get(`/api/v1/ships`)
      .expect(200);

    expect(shipsResponse.body.data.length).toBe(3);
  });

  it('/api/v1/contracts (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/contracts')
      .send({
        originPlanetId: 1,
        destinationPlanetId: 3,
        pilotId: 1,
        description: 'Contract description',
        value: 1000,
        resources: [
          { resourceId: 1, quantity: 10 },
          { resourceId: 2, quantity: 20 },
        ],
      })
      .expect(201);

    contract = response.body.data.id;
  });

  it('/api/v1/contracts (POST) - Invalid Planet Configuration', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/contracts')
      .send({
        originPlanetId: 1,
        destinationPlanetId: 2,
        pilotId: 1,
        description: 'Contract description',
        value: 1000,
        resources: [
          { resourceId: 1, quantity: 10 },
          { resourceId: 2, quantity: 20 },
        ],
      })
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body.errors).toContain(
          'Travel from planet:1 to planet:2 is not valid. Configure the travel in the travel-configs endpoint',
        );
      });
  });

  it('/api/v1/contracts/:id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/contracts/${contract}`)
      .expect(200)
      .then((response) => {
        expect(response.body.data).toHaveProperty('id', contract);
        expect(response.body.data.description).toBe('Contract description');
      });
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });
});
