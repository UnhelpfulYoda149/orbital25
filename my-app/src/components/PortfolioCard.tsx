import { Stock } from "../types";
import { Card } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface PortfolioCardProps {
  stock: Stock;
  numShares: number;
}

function PortfolioCard({ stock, numShares }: PortfolioCardProps) {
  return (
    <Card variant="outlined" sx={{ minWidth: 500 }}>
      <CardContent>
        <Typography variant="h5">{stock.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          ({stock.id})
        </Typography>
        <Typography variant="body1">Total units: {numShares}</Typography>
        <Typography variant="body1">
          Price: {stock.lastTradePrice.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          Value: {(stock.lastTradePrice * numShares).toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PortfolioCard;
