import { IQuoteAdapter } from "../adapter/quote";
import currency from "currency.js";

export class ConvertCurrencyUseCase {
  constructor(private quoteAdapter: IQuoteAdapter) {}

  async execute(amount: string): Promise<Map<String, Number>> {
    try {
      const value = currency(amount);
      const convertions = new Map<String, Number>();

      const res = await this.quoteAdapter.quote([
        "USD-BRL",
        "EUR-BRL",
        "INR-BRL",
      ]);

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
