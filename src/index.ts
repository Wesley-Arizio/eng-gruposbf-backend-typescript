import dotenv from "dotenv";
import { ConvertCurrencyFactory } from "./useCase/convertCurrencyFactory";
import { Server } from "./server";
import { PgDatabase } from "./database";
import config from "../knexfile";

dotenv.config();

(async function () {
  const port = parseInt(process.env.PORT!) ?? 3001;
  const pgdbConfig =
    process.env.ENV == "production" ? config.production : config.staging;
  const pgdb = new PgDatabase(pgdbConfig);

  await pgdb.init();

  const server = new Server(ConvertCurrencyFactory(pgdb));
  await server.init(port);
})();
