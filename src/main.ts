import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// hybrid application, APIs and microservices
async function bootstrap() {
  const logger = new Logger('Payments-Ms');
  // API
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  // Microservices
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: envs.NATS_SERVERS,
      },
    },
    { inheritAppConfig: true },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(envs.PORT);
  logger.log(`Payments Microservice running on port ${envs.PORT}`);
  logger.log(`Health check configured on Payments Microservice`);
}
bootstrap();
