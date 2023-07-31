import { Quote, QuoteAdapter } from "../../../src/adapter/quote";

jest.mock("axios");

import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface ApiResponse {
  [key: string]: {
    code: string;
    ask: string;
  };
}

describe("Quote", () => {
  it("Should successfuly return quote for required currencies with status code 200", async () => {
    const currencies = ["USD", "EUR", "IRN"];
    const adapter = new QuoteAdapter();
    const mockedGet = jest.fn();
    jest
      .spyOn(axios, "create")
      .mockImplementationOnce(
        () => ({ get: mockedGet } as unknown as AxiosInstance)
      );

    mockedGet.mockImplementationOnce(
      (): Promise<AxiosResponse<ApiResponse, any>> => {
        return new Promise((resolve) =>
          resolve({
            data: {
              USD: {
                code: "USD",
                ask: "4.7590",
              },
              EUR: {
                code: "EUR",
                ask: "4.9000",
              },
              INR: {
                code: "INR",
                ask: "19.1123",
              },
            },
            status: 200,
            statusText: "OK",
          } as unknown as AxiosResponse<ApiResponse, any>)
        );
      }
    );

    const response = await adapter.quote(currencies);
    const expected: Quote[] = [
      {
        currency: "USD",
        quote: "4.7590",
      },
      {
        currency: "EUR",
        quote: "4.9000",
      },
      {
        currency: "INR",
        quote: "19.1123",
      },
    ];

    expect(response).toStrictEqual(expected);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "https://economia.awesomeapi.com.br",
    });
    expect(mockedGet).toHaveBeenCalledWith("/json/last/USD,EUR,IRN");
  });
  it("Should throw error if response status code is different than 200", async () => {
    const currencies = ["USD", "EUR", "IRN"];
    const adapter = new QuoteAdapter();
    const mockedGet = jest.fn();
    jest
      .spyOn(axios, "create")
      .mockImplementationOnce(
        () => ({ get: mockedGet } as unknown as AxiosInstance)
      );

    mockedGet.mockImplementationOnce(
      (): Promise<AxiosResponse<ApiResponse, any>> => {
        return new Promise((resolve) =>
          resolve({
            data: null,
            status: 304,
            statusText: "ANOTHER TEXT",
          } as unknown as AxiosResponse<ApiResponse, any>)
        );
      }
    );

    await expect(adapter.quote(currencies)).rejects.toThrow(
      "Error getting quote for currencies, see the logs"
    );
  });
  it("Should throw error if the response does not contain the rigth data structure", async () => {
    const currencies = ["USD", "EUR", "IRN"];
    const adapter = new QuoteAdapter();
    const mockedGet = jest.fn();
    jest
      .spyOn(axios, "create")
      .mockImplementationOnce(
        () => ({ get: mockedGet } as unknown as AxiosInstance)
      );

    mockedGet.mockImplementationOnce(
      (): Promise<AxiosResponse<ApiResponse, any>> => {
        return new Promise((resolve) =>
          resolve({
            data: {
              USD: {
                other_key: "any value",
              },
            },
            status: 200,
            statusText: "OK",
          } as unknown as AxiosResponse<ApiResponse, any>)
        );
      }
    );

    await expect(adapter.quote(currencies)).rejects.toThrow(
      "Error getting quote for currencies, see the logs"
    );
  });
});
