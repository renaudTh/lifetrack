import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { REPO_SERVICE } from './domain/repo.service.interface';
import { ActivityDBO } from './entities/activity.entity';
import { RecordDBO } from './entities/record.entity';
import { RepoService } from './repo/repo.service';
import { AppLoggerMiddleware } from './utils/logger.middleware';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>("DB_HOST"),
        username: config.get<string>("DB_USERNAME"),
        database: config.get<string>("DB_NAME"),
        port: config.get<number>("DB_PORT"),
        password: config.get<string>("DB_PASSWORD"),
        entities: [ActivityDBO, RecordDBO],
        synchronize: true
      }),
    }), AuthModule],
  controllers: [AppController, HealthController],
  providers: [
    {
      provide: REPO_SERVICE,
      useClass: RepoService
    },
    AppService]
  ,
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppLoggerMiddleware)
      .forRoutes('*');
  }

}
