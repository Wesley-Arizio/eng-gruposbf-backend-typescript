import knex, { Knex } from "knex";

export interface IDatabase<T> {
  init(): Promise<void>;
  getConnection(): T;
}

export class PgDatabase implements IDatabase<Knex> {
  private connection: Knex | undefined;
  constructor(private config: Knex.Config) {}

  async init() {
    this.connection = knex(this.config);

    await this.connection.migrate.down();
    await this.connection.migrate.up();
  }

  getConnection(): Knex {
    if (!this.connection)
      throw new Error("Database connection did not started yet");
    return this.connection;
  }
}
