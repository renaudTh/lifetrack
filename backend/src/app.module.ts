import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { REPO_SERVICE } from './domain/repo.service.interface';
import { ActivityDBO } from './entities/activity.entity';
import { RecordDBO } from './entities/record.entity';
import { RepoService } from './repo/repo.service';
import { AppLoggerMiddleware } from './utils/logger.middleware';
import { DomainExceptionFilter } from './utils/domain-exception.filter';
import { HealthController } from './health.controller';

const REQUIRED_ENV = [
  'DB_HOST',
  'DB_USERNAME',
  'DB_NAME',
  'DB_PORT',
  'DB_PASSWORD',
  'AUTH0_AUDIENCE',
  'AUTH0_TENANT',
] as const;

// Without this guard a missing variable degrades silently: pg falls back to
// the OS user (`root`), and jwks-rsa queries an `undefined...` URL that
// answers 401 on every route.
const validateEnv = (env: Record<string, unknown>): Record<string, unknown> => {
  const missing = REQUIRED_ENV.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Configuration incomplete : ${missing.join(', ')}`);
  }
  return env;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        username: config.get<string>('DB_USERNAME'),
        database: config.get<string>('DB_NAME'),
        port: Number(config.get<string>('DB_PORT')),
        password: config.get<string>('DB_PASSWORD'),
        entities: [ActivityDBO, RecordDBO],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        // Migrations are the single source of truth for the schema, in dev as in
        // production: `synchronize` is what let migrations drift from entities.
        migrationsRun: true,
        synchronize: false,
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: REPO_SERVICE,
      useClass: RepoService,
    },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
