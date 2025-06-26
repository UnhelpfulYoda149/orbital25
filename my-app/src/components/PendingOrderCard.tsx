import { Card, Typography, Grid, Button } from "@mui/material";
import api from "../api";

type PendingOrderProps = {
  id: number;
  action: string;
  expiry: string;
  quantity: number;
  price: number;
  timestamp: string;
  stock: { symbol: string; name: string };
  refresh: () => void;
};

function PendingOrderCard({
  id,
  action,
  expiry,
  quantity,
  price,
  timestamp,
  stock,
  refresh,
}: PendingOrderProps) {
  const date = new Date(timestamp).toLocaleString();
  const isBuy = action === "buy";
  const isDay = expiry === "day";

  const cancelOrder = async (id: number) => {
    try {
      await api.post(
        "/user/cancel-order/",
        { id: id },
        { withCredentials: true }
      );
      refresh();
    } catch (err) {
      console.error("Error cancelling order", err);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "0.5rem",
        backgroundColor: isBuy ? "#D1FFBD" : "#FFC2C2",
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="left"
        spacing={0}
        position="relative"
      >
        <Typography variant="h6">
          <strong>{isBuy ? "Buy" : "Sell"}</strong>
        </Typography>
        <Typography variant="body1">
          {stock.name} ({stock.symbol}) @ <strong>${price.toFixed(2)}</strong>
        </Typography>
        <Typography variant="body1">
          Quantity: <strong>{quantity}</strong>
        </Typography>
        <Typography variant="body1">
          Expiry: <strong>{isDay ? "DayOnly" : "GTC"}</strong>
        </Typography>
        <Button
          variant="contained"
          sx={{ width: "30%", marginTop: "0.5rem" }}
          onClick={() => cancelOrder(id)}
        >
          Cancel Order
        </Button>
        <Typography variant="body1" position="absolute" bottom={0} right={5}>
          {date}
        </Typography>
      </Grid>
    </Card>
    // <div
    //   style={{
    //     border: "1px solid #ccc",
    //     borderRadius: "8px",
    //     padding: "1rem",
    //     marginBottom: "1rem",
    //     backgroundColor: isBuy ? "#D1FFBD" : "#FFC2C2",
    //   }}
    // >
    //   <h3 style={{ margin: "0", fontWeight: "bold" }}>
    //     {isBuy ? "Buy" : "Sell"}
    //   </h3>
    //   <p style={{ marginTop: "0.2rem", marginBottom: "1rem" }}>
    //     {stock.name} ({stock.symbol})
    //   </p>
    //   <p>
    //     <strong>Quantity:</strong> {quantity}
    //   </p>
    //   <p>
    //     <strong>Price:</strong> ${price.toFixed(2)}
    //   </p>
    //   <p>
    //     <strong>Date:</strong> {date}
    //   </p>
    // </div>
  );
}

export default PendingOrderCard;
