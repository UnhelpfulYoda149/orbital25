import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardActionArea } from "@mui/material";
import Header from "../components/Header";
import PortfolioCard from "../components/PortfolioCard";
import PortfolioSummaryCard from "../components/PortfolioSummaryCard";
import { PortfolioSummary, Stock } from "../types";
import api from "../api";

function PortfolioPage() {
  const username = localStorage.getItem("username");
  const [stocks, setStocks] = useState<PortfolioSummary[]>([]);
  const [money, setMoney] = useState<number>(0); // already excludes reserved
  const [reservedCash, setReservedCash] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getUserStocks = async () => {
    try {
      const res = await api.get("/portfolio-request/", {
        withCredentials: true,
      });
      const fetchedStocks = await Promise.all(
        res.data.map(async (obj: any) => {
          const res2 = await api.post(
            "/live-stock-request/",
            { symbol: obj.stock },
            { withCredentials: true }
          );
          return {
            stock: res2.data,
            quantity: obj.quantity,
            averagePrice: obj.average_price,
          };
        })
      );
      console.log(fetchedStocks);
      setStocks(fetchedStocks);
    } catch (error) {
      console.error("Portfolio retrieval error:", error);
    }
  };

  const getUserMoney = async () => {
    try {
      const res = await api.get("/user/money/", { withCredentials: true });
      setMoney(res.data.money); // buying power (already excludes reserved)
    } catch (err) {
      console.error("Failed to fetch cash data", err);
    }
  };

  const getReservedCash = async () => {
    try {
      const res = await api.get("/user/pending-orders/", {
        withCredentials: true,
      });
      const buyOrders = res.data.filter((order: any) => order.action === "buy");
      const totalReserved = buyOrders.reduce(
        (sum: number, order: any) => sum + order.price * order.quantity,
        0
      );
      setReservedCash(totalReserved);
    } catch (err) {
      console.error("Failed to fetch reserved cash", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getUserMoney(), getUserStocks(), getReservedCash()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleClick = (stock: Stock) => {
    navigate("/order", {
      state: { stock },
    });
  };

  return (
    <>
      <Header user={username} />
      <div style={{ padding: "2rem" }}>
        {!loading && (
          <PortfolioSummaryCard
            cash={money}
            reservedCash={reservedCash}
            stocks={stocks}
          />
        )}

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
              <CardActionArea onClick={() => handleClick(portfolioStock.stock)}>
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
