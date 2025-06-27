import { Stock } from "../types";
import { Card, Grid, IconButton } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import StockChange from "./StockChange";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState, useEffect } from "react";
import api from "../api";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";

interface StockCardProps {
  stock: Stock;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
}

function StockCard({
  stock,
  isWatchlisted,
  onToggleWatchlist,
}: StockCardProps) {
  const navigate = useNavigate();

  const handleClick = (stock: Stock) => {
    navigate("/stock", { state: { stock } });
  };

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation

    await api.post(
      "/user/watchlist/toggle/",
      { symbol: stock.symbol },
      { withCredentials: true }
    );
    onToggleWatchlist();
  };

  return (
    <Card
      variant="outlined"
      sx={{ minWidth: 500, position: "relative" }}
      onClick={() => handleClick(stock)}
    >
      <CardActionArea sx={{ padding: 2 }}>
        <Typography variant="h5">{stock.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          ({stock.symbol})
        </Typography>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <StockChange lastTrade={stock.lastTrade} prevClose={stock.close} />
        </Grid>
      </CardActionArea>
      <IconButton
        onClick={handleWatchlistToggle}
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
      >
        {isWatchlisted ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>
    </Card>
  );
}

export default StockCard;
