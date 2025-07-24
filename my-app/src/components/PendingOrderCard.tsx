import {
  Card,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import api from "../api";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);
  const date = new Date(timestamp).toLocaleString();
  const isBuy = action === "buy";
  const isDay = expiry === "day";

  const handleClose = () => {
    setOpen(false);
  };

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
          onClick={() => {
            setOpen(true);
          }}
        >
          Cancel Order
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle id="alert-dialog-title">
            Delete Pending Order?
          </DialogTitle>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleClose();
                cancelOrder(id);
              }}
              autoFocus
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
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
