import { DataSource } from 'typeorm';

// DataSource du CLI TypeORM uniquement (migration:generate / migration:show).
// L'application, elle, passe par ConfigService dans app.module.ts.
// A lancer avec `node --env-file=.env.local`.
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
