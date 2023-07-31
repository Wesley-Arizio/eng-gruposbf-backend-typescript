import axios from "axios";

export interface Quote {
  currency: string;
  quote: string;
}

export interface IQuoteAdapter {
  quote(currencies: String[]): Promise<Quote[]>;
}

// Reference https://docs.awesomeapi.com.br/api-de-moedas#legendas
interface ApiResponse {
  [key: string]: {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    varBid: string;
    pctChange: string;
    bid: string;
    ask: string;
    timestamp: string;
    create_date: Date;
  };
}

export class QuoteAdapter implements IQuoteAdapter {
  async quote(currencies: String[]): Promise<Quote[]> {
    const api = axios.create({
      baseURL: "https://economia.awesomeapi.com.br",
    });

    try {
      const response = await api.get<ApiResponse>(
        `/json/last/${currencies.toString()}`
      );

      if (response.status != 200) {
        console.warn({
          status: response.status,
          request: response.request,
        });
        throw new Error("Unexpected status code for this request");
      }

      const data = Object.entries(response.data).map(([_, props]) => props);
      return data.map((v) => {
        if (!("code" in v) || !("ask" in v)) {
          throw new Error(
            "The structure of the ApiResponse changed, update it according the docs"
          );
        }
        return { currency: v.code, quote: v.ask } as Quote;
      });
    } catch (error) {
      console.error("Quote error: ", error);
      throw new Error("Error getting quote for currencies, see the logs");
    }
  }
}
