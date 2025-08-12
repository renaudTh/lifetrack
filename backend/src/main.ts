import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.enableCors({ methods: ["GET", "HEAD", "POST", "PATCH"] });
  await app.listen({port: 5556, host: "0.0.0.0"});
}
bootstrap();
