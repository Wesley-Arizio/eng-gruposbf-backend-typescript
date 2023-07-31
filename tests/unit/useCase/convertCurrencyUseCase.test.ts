import { QuoteAdapter } from "../../../src/adapter/quote";
import { ConvertCurrencyUseCase } from "../../../src/useCase/convertCurrencyUseCase";

describe("ConvertCurrencyUseCase", () => {
  it("Should convert BRl amount to the required currencies", async () => {
    const adapter = new QuoteAdapter();
    const useCase = new ConvertCurrencyUseCase(adapter);

    const mockedQuote = jest.spyOn(adapter, "quote");

    mockedQuote.mockImplementationOnce(() => {
      return new Promise((resolve) =>
        resolve([
          {
            currency: "USD",
            quote: "4.7000",
          },
          {
            currency: "EUR",
            quote: "4.9000",
          },
          {
            currency: "INR",
            quote: "19.2000",
          },
        ])
      );
    });

    const response = await useCase.execute("52999");

    const expected = new Map();
    expected.set("USD", 11276);
    expected.set("EUR", 10816);
    expected.set("INR", 2760);

    expect(mockedQuote).toHaveBeenCalledWith(["USD-BRL", "EUR-BRL", "INR-BRL"]);
    expect(response).toStrictEqual(expected);
  });
  it("Should throw internal server error if anything goes wrong", async () => {
    const adapter = new QuoteAdapter();
    const useCase = new ConvertCurrencyUseCase(adapter);

    const mockedQuote = jest.spyOn(adapter, "quote");

    mockedQuote.mockImplementationOnce(() => {
      return new Promise((_, reject) => reject("Any Error"));
    });

    await expect(useCase.execute("52999")).rejects.toThrow(
      "Internal Server Error"
    );
    expect(mockedQuote).toHaveBeenCalledWith(["USD-BRL", "EUR-BRL", "INR-BRL"]);
  });
});
