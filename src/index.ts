import dotenv from "dotenv";
import { ConvertCurrencyFactory } from "./useCase/convertCurrencyFactory";
import { Server } from "./server";

dotenv.config();

(async function () {
  const port = parseInt(process.env.PORT!) || 3001;
  const server = new Server(ConvertCurrencyFactory());

  await server.init(port);
})();
