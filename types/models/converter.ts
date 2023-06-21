export interface ExchangeRatesResponse {
  rates: ExchangeRates;
}

export interface ExchangeRates {
  [key: string]: ExchangeRate;
}

export interface ExchangeRate {
  name: string;
  unit: string;
  value: number;
  type: string;
}