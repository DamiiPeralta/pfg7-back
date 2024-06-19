import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3001',
  'https://easy-task-cyan.vercel.app',
  'http://localhost:3000'
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      console.log('Origin:', origin); // Log para depuración
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('No permitido por CORS:', origin); // Log para depuración
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("EasyTask - Back")
    .setDescription("Trabajo realizado por el back-team del grupo 07 - WEBFT 48")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  await app.listen(PORT);
}

bootstrap();
