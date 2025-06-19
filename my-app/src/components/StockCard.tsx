import { Stock } from "../types";
import { Card } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface StockCardProps {
  stock: Stock;
}

function StockCard({ stock }: StockCardProps) {
  console.log("StockCard received:", stock);
  return (
    <Card variant="outlined" sx={{ minWidth: 500 }}>
      <CardContent>
        <Typography variant="h5">{stock.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          ({stock.symbol})
        </Typography>
        <Typography variant="body1">
          Last Trade Price: {stock.lastTrade.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          Open Price: {stock.open.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StockCard;
