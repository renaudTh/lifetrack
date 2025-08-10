import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityDBO } from './entities/activity.entity';
import { REPO_SERVICE } from './domain/repo.service.interface';
import { RepoService } from './repo/repo.service';
import { RecordDBO } from './entities/record.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
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
  controllers: [AppController],
  providers: [
    {
      provide: REPO_SERVICE,
      useClass: RepoService
    },
    AppService]
  ,
})
export class AppModule {

}
