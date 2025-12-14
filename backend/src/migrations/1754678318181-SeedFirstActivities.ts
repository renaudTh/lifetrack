import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedFirstActivities1754678318181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const baseActivities = [
      {
        representation: '🥩',
        description: 'Vegetarian exception',
        amount: 1,
        unit: 'u',
      },
      {
        representation: '🍺',
        description: 'Drink beer',
        amount: 25,
        unit: 'cl',
      },
      {
        representation: '🍷',
        description: 'Drink whine',
        amount: 1,
        unit: 'glass',
      },
      {
        representation: '🍹',
        description: 'Drink cocktail',
        amount: 1,
        unit: 'glass',
      },
      {
        representation: '🚋',
        description: 'Tram to work',
        amount: 1,
        unit: 'trip',
      },
      {
        representation: '🚴',
        description: 'Bike to work',
        amount: 4,
        unit: 'km',
      },
    ];
    const baseString = `INSERT INTO "Activities" (id, owner_id, representation, description, base_amount, unit)`;
    const userId = 'auth0|68931b8413511e47ebb031bb';

    const promises = baseActivities
      .map(
        (a) =>
          `VALUES ('${crypto.randomUUID()}', '${userId}','${a.representation}', '${a.description}', '${a.amount}', '${a.unit}')`,
      )
      .map((query) => queryRunner.query(`${baseString} ${query}`));

    await Promise.all(promises);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "Activities" RESTART IDENTITY;`);
  }
}
