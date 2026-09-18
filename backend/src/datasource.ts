import { DataSource } from 'typeorm';

// DataSource for the TypeORM CLI only (migration:generate / migration:show).
// The application itself goes through ConfigService in app.module.ts.
// Run it with `node --env-file=.env.local`.
export const LIFETRACK_DATASOURCE = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
