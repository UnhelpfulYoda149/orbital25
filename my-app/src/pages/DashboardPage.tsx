import StockCard from "../components/StockCard"; // make sure this exists
import { Stock } from "../types";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { loadAllStockData } from "../App";
import { useEffect, useState } from "react";
import { getSymbolPrice, getOpenPrice, getCompanyName } from "../fetchPrices";
import { supabase } from "../App";

const stockSymbols = [
  "AAPL",
  "GOOG",
  "MSFT",
  "NVDA",
  "AMZN",
  "TSLA",
  "META",
  "NFLX",
  "INTC",
  "AMD",
];

export default function DashboardPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const updateStockData = async () => {
      const promises = stockSymbols.map(async (symbol) => {
        const [companyName, lastPrice, openPrice] = await Promise.all([
          getCompanyName(symbol),
          getSymbolPrice(symbol),
          getOpenPrice(symbol),
        ]);

        if (lastPrice !== null && openPrice !== null) {
          return {
            id: symbol,
            name: companyName,
            lastTradePrice: lastPrice,
            openPrice: openPrice,
          };
        }
        return null;
      });

      const results = await Promise.all(promises);
      const updateData = results.filter(
        (stock): stock is Stock => stock !== null
      );
      const { error } = await supabase.from("Stocks").upsert(updateData);
      if (error) {
        console.log(error);
      }
    };
    updateStockData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      loadAllStockData().then((r) => {
        setStocks(r);
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {stocks.map((stock) => (
          <Card variant="outlined">
            <CardActionArea>
              <StockCard key={stock.id} stock={stock} />
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  );
}
