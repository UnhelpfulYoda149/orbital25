import { Stock } from "../types";
import PortfolioCard from "../components/PortfolioCard";
import { useState, useEffect } from "react";
import { supabase } from "../App";

type PortfolioSummary = {
  stock: Stock;
  numShares: number;
};

type StockSummary = {
  stock_id: string;
  numShares: number;
};

function PortfolioPage() {
  const [stocks, setStocks] = useState<PortfolioSummary[]>([]);
  useEffect(() => {
    const getUserStocks = async () => {
      const { data, error } = await supabase
        .from("Holdings")
        .select("stock_id, numShares")
        .eq(
          "user_id",
          await supabase.auth
            .getSession()
            .then((val) => val.data.session?.user.id)
        );
      if (error) {
        return [];
      }

      const results: StockSummary[] = data;
      const acc: Record<string, number> = {};
      for (const { stock_id, numShares } of results) {
        acc[stock_id] = (acc[stock_id] || 0) + Number(numShares);
      }

      const portfolio: PortfolioSummary[] = await Promise.all(
        Object.entries(acc).map(async ([stock_id, numShares]) => {
          const { data, error } = await supabase
            .from("Stocks")
            .select()
            .eq("id", stock_id);
          if (error) {
            throw error;
          }
          const result: Stock = data[0];
          return { stock: result, numShares: numShares };
        })
      );
      return portfolio;
    };

    getUserStocks().then((stocks) => setStocks(stocks));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>My Stocks</h2>
      {stocks.map((portfolioStock) => {
        return (
          <PortfolioCard
            stock={portfolioStock.stock}
            numShares={portfolioStock.numShares}
          />
        );
      })}
    </div>
  );
}

export default PortfolioPage;
