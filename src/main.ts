import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // REGLA ARQUITECTÓNICA 1: CORS habilitado
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      // REGLA ARQUITECTÓNICA 4: Manejo de errores con formato estricto
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => 
          err.constraints ? Object.values(err.constraints).join(', ') : ''
        );
        return new BadRequestException({ error: messages.join('. ') });
      },
    }),
  );

  // REGLA ARQUITECTÓNICA 2: Configuración de Swagger en la ruta /api
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Soporte TI')
    .setDescription('Sistema de tickets para soporte técnico')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  await app.listen(3000);
}
bootstrap();
