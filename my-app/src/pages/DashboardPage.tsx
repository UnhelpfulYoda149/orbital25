import StockCard from "../components/StockCard"; // make sure this exists
import { Stock } from "../types";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { loadAllStockData } from "../App";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
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
