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
  const [money, setMoney] = useState<number>(0);
  const navigate = useNavigate();

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
    } catch (error) {
      console.error("Portfolio retrieval error:", error);
      alert("Failed to retrieve your portfolio.");
    }
  };

  const getUserMoney = async () => {
    try {
      const res = await api.get("/user/money/", {
        withCredentials: true,
      });
      setMoney(res.data.money);
    } catch (err) {
      console.error("Failed to fetch cash data", err);
    }
  };

  useEffect(() => {
    getUserMoney();
    getUserStocks();
  }, []);

  const handleClick = (stock: Stock) => {
    navigate("/order", {
      state: {
        stock: stock,
      },
    });
  };

  console.log(typeof money);
return (
  <>
    <Header user={username} />
    <div style={{ padding: "2rem" }}>
      {/* Portfolio Summary */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1.5rem",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Total Portfolio Value: $
          {(
            money +
            stocks.reduce(
              (acc, cur) => acc + cur.stock.lastTrade * cur.quantity,
              0
            )
          ).toFixed(2)}
        </h1>

        <p>
          <strong>Buying Power (Cash):</strong> ${money.toFixed(2)}
        </p>
        <p>
          <strong>Stock Holdings Value:</strong> $
          {stocks
            .reduce((acc, cur) => acc + cur.stock.lastTrade * cur.quantity, 0)
            .toFixed(2)}
        </p>

        {/* Unrealized P&L */}
        {(() => {
          const totalCostBasis = stocks.reduce(
            (acc, cur) => acc + cur.averagePrice * cur.quantity,
            0
          );
          const totalMarketValue = stocks.reduce(
            (acc, cur) => acc + cur.stock.lastTrade * cur.quantity,
            0
          );
          const unrealizedPnL = totalMarketValue - totalCostBasis;
          const pnlColor = unrealizedPnL >= 0 ? "green" : "red";
          const pnlPrefix = unrealizedPnL >= 0 ? "+" : "";
          const pnlPercentage =
            totalCostBasis > 0
              ? ((unrealizedPnL / totalCostBasis) * 100).toFixed(2)
              : "0.00";

          return (
            <p>
              <strong>Total Unrealized P&L:</strong>{" "}
              <span style={{ color: pnlColor, fontWeight: "bold" }}>
                {pnlPrefix}${unrealizedPnL.toFixed(2)} ({pnlPrefix}
                {pnlPercentage}%)
              </span>
            </p>
          );
        })()}

        {/* Realized P&L */}
        <p>
          <strong>Total Realized P&L:</strong>{" "}
          <span style={{ fontWeight: "bold" }}>Coming soon</span>
        </p>

        {/* Daily Change */}
        <p>
          <strong>Today's Change:</strong>{" "}
          <span style={{ fontWeight: "bold" }}>Coming soon</span>
        </p>
      </div>

      {/* Stock Holdings List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <h2>My Stocks</h2>
        {stocks.map((portfolioStock) => (
          <Card
            key={portfolioStock.stock.symbol}
            variant="outlined"
            sx={{ width: 500 }}
          >
            <CardActionArea
              onClick={() => handleClick(portfolioStock.stock)}
            >
              <PortfolioCard
                stock={portfolioStock.stock}
                numShares={portfolioStock.quantity}
                averagePrice={portfolioStock.averagePrice}
              />
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  </>
);
}

export default PortfolioPage;
