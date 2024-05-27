import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './midldleware/logger.middelware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGlobal)
  app.useGlobalPipes(new ValidationPipe)

  const swaggerConfig = new DocumentBuilder()
    .setTitle("EasyTask - Back")
    .setDescription("Trabajo realizado por el back-team del grupo 07 - WEBFT 48")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document)
  await app.listen(3000); 
}

bootstrap();