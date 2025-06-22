import { Stock } from "../types";
import { Card, Grid, IconButton } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import StockChange from "./StockChange";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState, useEffect } from "react";
import api from "../api";

interface StockCardProps {
  stock: Stock;
  isWatchlisted?: boolean;
  onToggleWatchlist?: () => void;
}

function StockCard({ stock, isWatchlisted, onToggleWatchlist }: StockCardProps) {
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // ⛔ Prevent navigation
    onToggleWatchlist?.();
  };

  return (
    <Card variant="outlined" sx={{ minWidth: 500, position: "relative" }}>
      <CardContent>
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

        <Typography variant="h5">{stock.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          ({stock.symbol})
        </Typography>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <StockChange lastTrade={stock.lastTrade} open={stock.open} />
        </Grid>
      </CardContent>
    </Card>
  );
}

export default StockCard;
