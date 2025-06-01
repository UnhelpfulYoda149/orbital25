import { Stock, StockNames } from "../types";

import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface StockCardProps {
  stock: Stock;
}

function StockCard({ stock }: StockCardProps) {
  return (
    <CardContent>
      <Typography variant="h5">{stock.id}</Typography>
      <Typography variant="body1">
        Last Trade Price: {stock.lastTradePrice}
      </Typography>
      <Typography variant="body1">Open Price: {stock.openPrice}</Typography>
    </CardContent>
  );
}

export default StockCard;
