import { IQuoteAdapter } from "../adapter/quote";
import currency from "currency.js";
import { IRepository, Currency } from "../repository/currencyRepository";

export class ConvertCurrencyUseCase {
  constructor(
    private quoteAdapter: IQuoteAdapter,
    private currencyRepository: IRepository<Currency>
  ) {}

  async execute(amount: string): Promise<Map<String, Number>> {
    try {
      const value = currency(amount);
      const convertions = new Map<String, Number>();

      const currencies = (await this.currencyRepository.getAll()).map(
        (c) => c.currency
      );

      const res = await this.quoteAdapter.quote(currencies);

      res.forEach((v) => {
        const quote = currency(v.quote).multiply(100);
        const converted = value.divide(quote).multiply(100);
        convertions.set(v.currency, converted.value);
      });

      return convertions;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }
}
