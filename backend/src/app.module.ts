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

// Sans ce garde-fou, une variable manquante degenere silencieusement : pg
// retombe sur l'utilisateur OS (`root`), et jwks-rsa interroge une URL
// `undefined...` qui renvoie 401 sur toutes les routes.
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
        // Les migrations sont l'unique source de verite du schema, en dev comme en prod :
        // `synchronize` en dev est ce qui a fait diverger les migrations des entites.
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
