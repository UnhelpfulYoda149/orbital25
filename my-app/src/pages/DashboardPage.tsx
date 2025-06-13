import StockCard from "../components/StockCard"; // make sure this exists
import { Stock } from "../types";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
//import { loadAllStockData } from "../App";
import { useEffect, useState, MouseEvent } from "react";
import { getSymbolPrice, getOpenPrice, getCompanyName } from "../fetchPrices";
//import { supabase } from "../App";
import { useNavigate } from "react-router-dom";

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

export default function DashboardPage() {/*
  const [stocks, setStocks] = useState<Stock[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const updateStockData = async () => {
      const promises = stockSymbols.map(async (symbol) => {
        //Call API
        const [companyName, lastPrice, openPrice] = await Promise.all([
          getCompanyName(symbol),
          getSymbolPrice(symbol),
          getOpenPrice(symbol),
        ]);

        // if everything comes back, create object
        if (companyName !== null && lastPrice !== null && openPrice !== null) {
          return {
            id: symbol,
            name: companyName,
            lastTradePrice: lastPrice,
            openPrice: openPrice,
          };
        }

        // if not return null
        return null;
      });

      const results = await Promise.all(promises);
      const updateData = results.filter(
        (stock): stock is Stock => stock !== null
      );

      //Update database with live data
      const { error } = await supabase.from("Stocks").upsert(updateData);
      if (error) {
        console.log(error);
      }
    };
    // Calls the above function once when the page is loaded
    updateStockData();
  }, []);

  useEffect(() => {
    // Fetch live stock data from database
    const fetchData = async () => {
      loadAllStockData().then((r) => {
        setStocks(r);
      });
    };
    fetchData();
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
      <h1>Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {stocks.map((stock) => (
          <Card variant="outlined">
            <CardActionArea onClick={() => handleClick(stock)}>
              <StockCard key={stock.id} stock={stock} />
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  );*/
}
