import { DataSource } from "typeorm";

export const LIFETRACK_DATASOURCE = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'lifetrack',
    database: 'lifetrack-dev',
    port: 5555,
    password: 'devpass',
    entities: ["src/entities/**/*.entity.ts"],
    migrations: ["src/migrations/**/*.ts"],
})