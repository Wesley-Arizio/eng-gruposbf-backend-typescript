import request from "supertest";
import { Server } from "../../src/server";
import { ConvertCurrencyUseCase } from "../../src/useCase/convertCurrencyUseCase";
import express from "express";
import { QuoteAdapter } from "../../src/adapter/quote";
describe("Server", () => {
  let connection: express.Express;
  let quoteAdapter = new QuoteAdapter();
  let converCurrencyUseCase = new ConvertCurrencyUseCase(quoteAdapter);
  let server = new Server(converCurrencyUseCase);
  beforeEach(async function () {
    connection = await server.init(4002);
  });
  afterEach(function () {
    server.closeConnection();
  });
  it("Should be able to call /api/convert to convert BRL to other currencies", async () => {
    jest.spyOn(quoteAdapter, "quote").mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve([
          {
            currency: "USD",
            quote: "4.78",
          },
          {
            currency: "EUR",
            quote: "5.24",
          },
          {
            currency: "INR",
            quote: "0.058",
          },
        ]);
      });
    });
    await request(connection)
      .get("/api/convert/52999")
      .expect(200, { USD: 11088, EUR: 10114, INR: 883317 });
  });

  it("Should return bad request if something went wrong", async () => {
    jest.spyOn(converCurrencyUseCase, "execute").mockImplementationOnce(() => {
      return new Promise((_, reject) => {
        return reject("Internal Server Error");
      });
    });
    await request(connection).get("/api/convert/52999").expect(400);
    expect(converCurrencyUseCase.execute).toHaveBeenCalled();
  });
});
