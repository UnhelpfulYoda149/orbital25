import { Stock } from "../types";
import { Card, Grid } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import StockChange from "./StockChange";

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
        <Grid container direction="row" alignItems="center" spacing={1}>
          <StockChange lastTrade={stock.lastTrade} open={stock.open} />
        </Grid>
      </CardContent>
    </Card>
  );
}

export default StockCard;
