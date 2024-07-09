import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { useContainer } from 'class-validator';
//import { ConfigService } from '@nestjs/config';
import { loadEnvConfig } from './env.config';

dotenv.config();

declare const module: any;

async function bootstrap() {
  await loadEnvConfig();
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configure the application
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors({
    origin: '*',
    methods: '*',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Start microservices and serve static assets
  await app.startAllMicroservices();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');
  
  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Sofyrus Gig Platform')
    .setDescription('Sofyrus Gig Platform Portal Swagger API Documentation!!!')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  
  // Start the application
  await app.listen(3002);
  
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }  
}

bootstrap();
