import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("currencies", function (table) {
    table.string("currency");
    table.boolean("active").defaultTo(false);
  });

  const currencies = ["USD-BRL", "EUR-BRL", "INR-BRL"];

  for (const c of currencies) {
    await knex.table("currencies").insert({ currency: c, active: true });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("currencies");
}
