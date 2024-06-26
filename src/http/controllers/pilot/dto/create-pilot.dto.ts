import { IsNumber } from 'class-validator';
import { ValidPlanet } from 'src/domains/planet/validators/valid-planet.decorator';

export class CreatePilotDto {
  @IsNumber()
  @ValidPlanet()
  locationPlanetId: number;
}
