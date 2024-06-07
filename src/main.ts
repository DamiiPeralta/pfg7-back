import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './midldleware/logger.middelware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import { auth } from 'express-openid-connect';
import {config as auth0Config} from './config/auth0.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGlobal)
  //app.use(auth(auth0Config))
  app.useGlobalPipes(new ValidationPipe)

  // Configuración de CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Cambia esto por el origen permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

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