import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import currency from "currency.js";

dotenv.config();

const app = express();

const port = process.env.API_PORT || 3001;

// https://docs.awesomeapi.com.br/api-de-moedas#legendas
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

app.get("/api/convert/:amount", async (req, res) => {
  try {
    const amountInCents = currency(req.params.amount);
    const api = axios.create({
      baseURL: "https://economia.awesomeapi.com.br/",
    });
    const response = await api.get<ApiResponse>(
      `/json/last/USD-BRL,EUR-BRL,INR-BRL`
    );
    const data = Object.entries(response.data).map(([_, rest]) => rest);
    const convertions = new Map();

    data.map((o) => {
      if (o.ask && o.codein) {
        const rate = currency(o.ask).multiply(100);

        const converted = amountInCents.divide(rate).multiply(100);
        convertions.set(o.code, converted.value);
      }
    });

    return res
      .status(200)
      .send(JSON.stringify(Object.fromEntries(convertions)));
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server runnint at http://localhost:${port}`);
});
