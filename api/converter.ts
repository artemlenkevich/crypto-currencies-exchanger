import { ExchangeRates } from "@/types/models";

interface ErrorResponse {
  status: {
    error_code: number;
    error_message: string;
  };
}

export async function getExchangeRates(): Promise<{
  rates: ExchangeRates;
  errorMessage?: string;
}> {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.status.error_message);
    }

    const data = await response.json();
    return { rates: data.rates };
  } catch (error) {
    let errorMessage: string =
      error instanceof Error ? error.message : JSON.stringify(error);
    return { rates: {}, errorMessage };
  }
}
