import StockCard from "../components/StockCard"; // make sure this exists
import { Stock } from "../types";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { useEffect, useState, MouseEvent } from "react";
import { getSymbolPrice, getOpenPrice, getCompanyName } from "../fetchPrices";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../api";

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
  const username = localStorage.getItem("username");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAllStockData() {
      api.get<Stock[]>("/liveStock/").then((r) => {
        setStocks(r.data);
      });
    }

    loadAllStockData();
  }, []);

  const handleClick = (stock: Stock) => {
    navigate("/order", {
      state: {
        stock: stock,
      },
    });
  };

  return (
    <div>
      <Header user={username} />
      <h1>Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {stocks.map((stock) => (
          <Card key={stock.symbol} variant="outlined">
            <CardActionArea onClick={() => handleClick(stock)}>
              <StockCard stock={stock} />
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  );
}
