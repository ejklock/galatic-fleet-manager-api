import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { CreateShipDto } from './http/controllers/ship/dto/create-ship.dto';
import { HttpModule } from './http/http.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Use DocumentBuilder to create a new Swagger document configuration
  const config = new DocumentBuilder()

    .setTitle('Galactic Fleet Manager API') // Set the title of the API
    .setDescription(
      'An application to manage the transport fleet of goods through the galaxy, including four planets.',
    ) // Set the description of the API
    .setVersion('v1') // Set the version of the API
    .build(); // Build the document

  // Create a Swagger document using the application instance and the document configuration
  const document = SwaggerModule.createDocument(app, config, {
    include: [HttpModule],
    extraModels: [CreateShipDto],
    deepScanRoutes: true,
  });

  // Setup Swagger module with the application instance and the Swagger document
  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT || 3333);

  Logger.verbose(`Running API on port ${process.env.PORT || 3333}`, 'Main.ts');
}
bootstrap();
