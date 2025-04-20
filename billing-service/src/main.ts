/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as fs from 'fs';

import { AppConfigService } from '@app-zurich-backend/shared';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<AppConfigService>(AppConfigService);

  // Enable Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Enable Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.swaggerConfig.app_name)
    .setDescription(configService.swaggerConfig.app_desc)
    .setVersion(configService.swaggerConfig.app_version)
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-roles',
        in: 'header',
        description: 'Enter user role',
      },
      'X-API-ROLES',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup(`doc/${configService.swaggerConfig.app_name}`, app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/v1`);
}

bootstrap();
