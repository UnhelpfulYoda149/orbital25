import { Card, CardContent, CardActionArea, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Stock } from "../types";
import api from "../api";
import StockCard from "./StockCard";
import { useNavigate } from "react-router-dom";

export interface PostCardProps {
  username: string;
  action: string;
  price: number;
  quantity: number;
  symbol: string;
  timestamp: string;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
}

function PostCard({
  username,
  action,
  price,
  quantity,
  symbol,
  timestamp,
  isWatchlisted,
  onToggleWatchlist,
}: PostCardProps) {
  const date = new Date(timestamp).toLocaleString();
  const isBuy = action === "buy";
  const [stock, setStock] = useState<Stock>();
  const navigate = useNavigate();

  const fetchStock = async () => {
    try {
      const res = await api.post(
        "/live-stock-request/",
        { symbol: symbol },
        { withCredentials: true }
      );
      setStock(res.data);
    } catch (err) {
      console.error("Error fetching stock data", err);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleClick = (stock: Stock) => {
    navigate("/stock", { state: { stock } });
  };

  return (
    <Card
      variant="elevation"
      sx={{
        minWidth: 500,
        position: "relative",
        marginTop: 3,
        backgroundColor: isBuy ? "#D1FFBD" : "#FFC2C2",
      }}
    >
      <CardContent>
        <Typography variant="h5">
          {username + (isBuy ? " bought" : " sold")}
        </Typography>
        <Typography variant="body1">{`${quantity} units of ${symbol} @ $${price.toFixed(
          2
        )}`}</Typography>
        {stock && (
          <CardActionArea onClick={() => handleClick(stock)}>
            <StockCard
              isWatchlisted={isWatchlisted}
              stock={stock}
              onToggleWatchlist={onToggleWatchlist}
            />
          </CardActionArea>
        )}
        <Typography variant="body2">{date}</Typography>
      </CardContent>
    </Card>
  );
}

export default PostCard;
