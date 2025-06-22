import { Stock } from "../types";
import PortfolioCard from "../components/PortfolioCard";
import { useState, useEffect } from "react";
//import { supabase } from "../App";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../api";
import { PortfolioSummary } from "../types";

type StockSummary = {
  stock_id: string;
  numShares: number;
};

function PortfolioPage() {
  const username = localStorage.getItem("username");
  const [stocks, setStocks] = useState<PortfolioSummary[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserStocks = async () => {
      // Find all stocks in database belonging to current user
      try {
        const res = await api.get("/portfolio-request/", {
          withCredentials: true,
        });
        const fetchedStocks = await Promise.all(
          res.data.map(
            async (obj: {
              stock: string;
              quantity: number;
              average_price: number;
            }) => {
              const res2 = await api.post(
                "/live-stock-request/",
                {
                  symbol: obj.stock,
                },
                { withCredentials: true }
              );
              const stock = res2.data;
              return {
                stock: stock,
                quantity: obj.quantity,
                averagePrice: obj.average_price,
              };
            }
          )
        );
        setStocks(fetchedStocks);
        console.log(stocks);
      } catch (error) {
        console.error("Portfolio retrieval error:", error);
        alert("Failed to retrieve your portfolio.");
      }
    };

    getUserStocks();
  }, []);

  const handleClick = (stock: Stock) => {
    navigate("/order", {
      state: {
        stock: stock,
      },
    });
  };

  return (
    <>
      <Header user={username} />
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
                  numShares={portfolioStock.quantity}
                />
              </CardActionArea>
            </Card>
          );
        })}
        <h4>
          Total Portfolio Value:{" $"}
          {stocks
            .reduce((acc, cur) => acc + cur.stock.lastTrade * cur.quantity, 0)
            .toFixed(2)}
        </h4>
      </div>
    </>
  );
}

export default PortfolioPage;
