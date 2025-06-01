import { Stock, StockNames } from "../types";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface StockCardProps {
  stock: Stock;
}

function StockCard({ stock }: StockCardProps) {
  return (
    <Card variant="outlined" sx={{ minWidth: 500 }}>
      <CardContent>
        <Typography variant="h5">{stock.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          ({stock.id})
        </Typography>
        <Typography variant="body1">
          Last Trade Price: {stock.lastTradePrice.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          Open Price: {stock.openPrice.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StockCard;
