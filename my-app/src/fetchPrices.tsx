export async function getSymbolPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.REACT_APP_FINNHUB_KEY}`
    );
    const data = await res.json();
    return data.c; // current price
  } catch (error) {
    console.error("Failed to fetch price:", error);
    return null;
  }
}

export async function getOpenPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.REACT_APP_FINNHUB_KEY}`
    );
    const data = await res.json();
    return data.o; // open price
  } catch (error) {
    console.error("Failed to fetch open price:", error);
    return null;
  }
}

export async function getCompanyName(symbol: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.REACT_APP_FINNHUB_KEY}`
    );
    const data = await res.json();
    console.log(data);
    return data.name;
  } catch (error) {
    console.error("Failed to fetch company name", error);
    return null;
  }
}
