import request from "supertest";
import { Server } from "../../src/server";
import { ConvertCurrencyUseCase } from "../../src/useCase/convertCurrencyUseCase";
import express from "express";
import { QuoteAdapter } from "../../src/adapter/quote";
import { PgDatabase } from "../../src/database";
import { CurrencyRepository } from "../../src/repository/currencyRepository";
import config from "../../knexfile";
describe("Server", () => {
  let connection: express.Express;
  let database: PgDatabase;
  let repository: CurrencyRepository;
  let quoteAdapter: QuoteAdapter;
  let converCurrencyUseCase: ConvertCurrencyUseCase;
  let server: Server;
  beforeEach(async function () {
    quoteAdapter = new QuoteAdapter();
    database = new PgDatabase(config.development);
    await database.init();
    repository = new CurrencyRepository(database);
    converCurrencyUseCase = new ConvertCurrencyUseCase(
      quoteAdapter,
      repository
    );
    server = new Server(converCurrencyUseCase);
    connection = await server.init(4002);
  });
  afterEach(async function () {
    server.closeConnection();
    await database.getConnection().destroy();
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
