import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface StockChangeProps {
  lastTrade: number;
  open: number;
}

function StockChange({ lastTrade, open }: StockChangeProps) {
  if (lastTrade - open == 0.0) {
    return (
      <>
        <Typography variant="body1">${lastTrade.toFixed(2)}</Typography>
        <Typography variant="body1">
          ${(lastTrade - open).toFixed(2)}
        </Typography>
        <Typography variant="body1">
          ({(((lastTrade - open) / open) * 100).toFixed(2)}
          %)
        </Typography>
      </>
    );
  } else {
    return (
      <>
        <Box
          component="img"
          src={lastTrade - open > 0 ? "/uparrow.png" : "/downarrow.png"}
          sx={{ height: "1vw" }}
        />
        <Typography variant="body1">${lastTrade.toFixed(2)}</Typography>
        <Typography
          variant="body1"
          color={lastTrade - open > 0 ? "green" : "red"}
        >
          {lastTrade - open > 0 ? "+$" : "-$"}
          {Math.abs(lastTrade - open).toFixed(2)}
        </Typography>
        <Typography
          variant="body1"
          color={lastTrade - open > 0 ? "green" : "red"}
        >
          ({(((lastTrade - open) / open) * 100).toFixed(2)}
          %)
        </Typography>
      </>
    );
  }
}

export default StockChange;
