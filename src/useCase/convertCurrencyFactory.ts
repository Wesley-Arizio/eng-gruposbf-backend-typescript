import { QuoteAdapter } from "../adapter/quote";
import { ConvertCurrencyUseCase } from "./convertCurrencyUseCase";

export const ConvertCurrencyFactory = () => {
  return new ConvertCurrencyUseCase(new QuoteAdapter());
};
