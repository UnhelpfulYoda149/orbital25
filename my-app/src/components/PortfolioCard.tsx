import { Stock } from "../types";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface PortfolioCardProps {
  stock: Stock;
  numShares: number;
  averagePrice: number;
}

function PortfolioCard({ stock, numShares, averagePrice }: PortfolioCardProps) {
  const currentValue = stock.lastTrade * numShares;
  const costBasis = averagePrice * numShares;
  const pnl = currentValue - costBasis;
  const pnlPercent = (pnl / costBasis) * 100 || 0;
  const pnlColor = pnl >= 0 ? "green" : "red";

  const formattedPnL = `${pnl >= 0 ? "+" : "-"}$${pnl.toFixed(2)}`;
  const formattedPnLPercent = `${
    pnlPercent >= 0 ? "+" : "-"
  }${pnlPercent.toFixed(2)}%`;

  return (
    <Card variant="outlined" sx={{ minWidth: 500 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left Section */}
          <Box>
            <Typography variant="h5">{stock.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              ({stock.symbol})
            </Typography>
            <Typography variant="body1">Total units: {numShares}</Typography>
            <Typography variant="body1">
              Current Price: ${stock.lastTrade.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              Average Cost Price: ${averagePrice.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              Value: ${currentValue.toFixed(2)}
            </Typography>
          </Box>

          {/* Right Section - P&L */}
          <Box sx={{ textAlign: "right", marginRight: 2 }}>
            <Typography
              variant="h6"
              sx={{ color: pnlColor, fontWeight: "bold" }}
            >
              {formattedPnL}
            </Typography>
            <Typography variant="body2" sx={{ color: pnlColor }}>
              {formattedPnLPercent}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default PortfolioCard;
