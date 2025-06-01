import { useEffect, useState } from "react";
import { getCompanyName, getSymbolPrice, getOpenPrice } from "../fetchPrices";
import StockCard from "../components/StockCard"; // make sure this exists
import { Stock } from "../types";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { supabase } from "../App";
import { useNavigate } from "react-router-dom";
import OrderPage from "./OrderPage";

interface DashboardPageProps {
  stocksInput: Stock[];
}

export default function DashboardPage({ stocksInput }: DashboardPageProps) {
  const [stocks, setStocks] = useState<Stock[]>([]);

  // useEffect(() => {
  //   const loadStockData = async () => {
  //     const promises = stockSymbols.map(async (symbol) => {
  //       const [name, lastPrice, openPrice] = await Promise.all([
  //         getCompanyName(symbol),
  //         getSymbolPrice(symbol),
  //         getOpenPrice(symbol),
  //       ]);

  //       if (lastPrice !== null && openPrice !== null) {
  //         return {
  //           id: symbol,
  //           lastTradePrice: lastPrice,
  //           openPrice: openPrice,
  //         };
  //       }
  //       if (name && lastPrice !== null && openPrice !== null) {
  //         return {
  //           id: symbol,
  //           name,
  //           lastTradePrice: lastPrice,
  //           openPrice: openPrice,
  //         };
  //       }

  //       return null;
  //     });

  //     const results = await Promise.all(promises);
  //     setStocks(results.filter((stock): stock is Stock => stock !== null));
  //   };

  //   loadStockData();

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {stocksInput.map((stock) => (
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
