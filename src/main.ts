import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { HttpModule } from './http/http.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()

    .setTitle('Galactic Fleet Manager API')
    .setDescription(
      'An application to manage the transport fleet of goods through the galaxy, including four planets.',
    )
    .setVersion('v1')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [HttpModule],
    extraModels: [],
    deepScanRoutes: true,
  });

  SwaggerModule.setup('/', app, document, {
    useGlobalPrefix: true,
    customSiteTitle: 'Galactic Fleet Manager API',
    jsonDocumentUrl: '/api.json',
    yamlDocumentUrl: '/api.yaml',
  });

  await app.listen(process.env.PORT || 3333);

  Logger.verbose(`Running API on port ${process.env.PORT || 3333}`, 'Main.ts');
}
bootstrap();
