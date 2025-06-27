import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface StockChangeProps {
  lastTrade: number;
  prevClose: number;
}

function StockChange({ lastTrade, prevClose }: StockChangeProps) {
  if (lastTrade - prevClose == 0.0) {
    return (
      <>
        <Typography variant="body1">${lastTrade.toFixed(2)}</Typography>
        <Typography variant="body1">
          ${(lastTrade - prevClose).toFixed(2)}
        </Typography>
        <Typography variant="body1">
          ({(((lastTrade - prevClose) / prevClose) * 100).toFixed(2)}
          %)
        </Typography>
      </>
    );
  } else {
    return (
      <>
        <Box
          component="img"
          src={lastTrade - prevClose > 0 ? "/uparrow.png" : "/downarrow.png"}
          sx={{ height: "1vw" }}
        />
        <Typography variant="body1">${lastTrade.toFixed(2)}</Typography>
        <Typography
          variant="body1"
          color={lastTrade - prevClose > 0 ? "green" : "red"}
        >
          {lastTrade - prevClose > 0 ? "+$" : "-$"}
          {Math.abs(lastTrade - prevClose).toFixed(2)}
        </Typography>
        <Typography
          variant="body1"
          color={lastTrade - prevClose > 0 ? "green" : "red"}
        >
          ({(((lastTrade - prevClose) / prevClose) * 100).toFixed(2)}
          %)
        </Typography>
      </>
    );
  }
}

export default StockChange;
