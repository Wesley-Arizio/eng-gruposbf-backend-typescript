import { Knex } from "knex";
import { IDatabase } from "../database";

export interface Currency {
  currency: String;
  active: Boolean;
}

export interface IRepository<T> {
  getAll(limit?: number): Promise<T[]>;
}

export class CurrencyRepository implements IRepository<Currency> {
  private tableName = "currencies";
  private connection: Knex;
  constructor(database: IDatabase<Knex>) {
    this.connection = database.getConnection();
  }

  async getAll(limit?: number): Promise<Currency[]> {
    if (limit) {
      return this.connection
        .select("*")
        .from(this.tableName)
        .where({ active: true })
        .limit(limit);
    }

    return this.connection
      .select("*")
      .from(this.tableName)
      .where({ active: true });
  }
}
