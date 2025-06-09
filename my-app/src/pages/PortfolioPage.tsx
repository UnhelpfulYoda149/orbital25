import { Stock } from "../types";
import PortfolioCard from "../components/PortfolioCard";
import { useState, useEffect } from "react";
import { supabase } from "../App";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const getUserStocks = async () => {
      // Find all stocks in database belonging to current user
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

  const handleClick = (stock: Stock) => {
    navigate("/order", {
      state: {
        stock: stock,
      },
    });
  };

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
          <Card variant="outlined">
            <CardActionArea onClick={() => handleClick(portfolioStock.stock)}>
              <PortfolioCard
                stock={portfolioStock.stock}
                numShares={portfolioStock.numShares}
              />
            </CardActionArea>
          </Card>
        );
      })}
      <h4>
        Total Portfolio Value:{" $"}
        {stocks
          .reduce(
            (acc, cur) => acc + cur.stock.lastTradePrice * cur.numShares,
            0
          )
          .toFixed(2)}
      </h4>
    </div>
  );
}

export default PortfolioPage;
