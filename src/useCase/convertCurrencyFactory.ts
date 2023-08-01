import { QuoteAdapter } from "../adapter/quote";
import { PgDatabase } from "../database";
import { CurrencyRepository } from "../repository/currencyRepository";
import { ConvertCurrencyUseCase } from "./convertCurrencyUseCase";

export const ConvertCurrencyFactory = (database: PgDatabase) => {
  return new ConvertCurrencyUseCase(
    new QuoteAdapter(),
    new CurrencyRepository(database)
  );
};
