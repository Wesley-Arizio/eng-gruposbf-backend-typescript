import express, { Request, Response } from "express";
import { ConvertCurrencyUseCase } from "./useCase/convertCurrencyUseCase";
import http from "http";

export class Server {
  private app: express.Express;
  private http: http.Server | undefined;
  constructor(private convertCurrencyUseCase: ConvertCurrencyUseCase) {
    this.app = express();
  }
  public async init(apiPort: number): Promise<express.Express> {
    this.app.get("/api/convert/:amount", this.handleConvertCurrency.bind(this));

    this.http = this.app.listen(apiPort, () => {
      console.log("Server started successfuly!");
    });

    return this.app;
  }

  private async handleConvertCurrency(req: Request, res: Response) {
    try {
      const amount = req.params.amount;
      const response = await this.convertCurrencyUseCase.execute(amount);
      return res
        .status(200)
        .json(JSON.parse(JSON.stringify(Object.fromEntries(response))));
    } catch (e) {
      console.error(e);
      return res.sendStatus(400);
    }
  }

  public closeConnection() {
    this.http?.close();
  }
}
