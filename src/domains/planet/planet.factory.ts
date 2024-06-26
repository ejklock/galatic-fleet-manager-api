import { faker } from '@faker-js/faker';
import { PlanetEntity } from './planet.entity';

export const PlanetFactory = (): PlanetEntity => {
  const planet = new PlanetEntity();
  planet.name = faker.helpers.arrayElement([
    'Andvari',
    'Demeter',
    'Aqua',
    'Calas',
  ]);
  return planet;
};
