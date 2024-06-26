import { faker } from '@faker-js/faker';
import { TravelConfigEntity } from './travel-config.entity';

export const TravelConfigFactory = () => {
  const travelConfig = new TravelConfigEntity();
  travelConfig.fromPlanetId = faker.number.int({ min: 1, max: 4 });
  travelConfig.toPlanetId = faker.number.int({ min: 1, max: 4 });
  travelConfig.fuelConsumption = faker.helpers.arrayElement([
    12, 13, 15, 20, 23, 22, 25, 30,
  ]);

  return travelConfig;
};
