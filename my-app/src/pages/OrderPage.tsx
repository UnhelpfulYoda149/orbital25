import { Stock } from "../types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { MouseEvent, useState, useEffect, ChangeEvent, FormEvent } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import StockCard from "../components/StockCard";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { Order, Instruction, Expiry } from "../types";
import api from "../api";

function OrderPage() {
  const location = useLocation();
  const username = localStorage.getItem("username");
  const [orderType, setOrderType] = useState<Order>("buy");
  const [instructionType, setInstructionType] = useState<Instruction>("limit");
  const [expiryType, setExpiryType] = useState<Expiry>("gtc");
  const [numShares, setNumShares] = useState<number>(0);
  const [orderPrice, setOrderPrice] = useState<number>(0);
  const stock: Stock = location.state.stock;
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const fetchWatchlist = async () => {
    try {
      const res = await api.get("/api/user/watchlist/");
      console.log(res);
      const symbols: string[] = res.data.map((item: any) => item.stock);
      setWatchlist(symbols);
    } catch (err) {
      console.error("Failed to fetch watchlist", err);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleOrderChange = (
    event: MouseEvent<HTMLElement>,
    newOrderType: Order
  ) => {
    if (newOrderType !== null) {
      setOrderType(newOrderType);
    }
  };

  const handleInstructionChange = (
    event: MouseEvent<HTMLElement>,
    newInstructionType: Instruction
  ) => {
    if (newInstructionType !== null) {
      setInstructionType(newInstructionType);
    }
  };

  const handleExpiryChange = (
    event: MouseEvent<HTMLElement>,
    newExpiryType: Expiry
  ) => {
    if (newExpiryType !== null) {
      setExpiryType(newExpiryType);
    }
  };

  const handleNumSharesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) {
      setNumShares(num);
      console.log(numShares);
    }
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) {
      setOrderPrice(num);
    }
  };

  const resetForm = () => {
    setNumShares(0);
    setOrderPrice(0);
    setExpiryType("gtc");
    setInstructionType("limit");
    setOrderType("buy");
  };

  const handleOrderSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/api/place-order/",
        {
          stock: stock.symbol,
          action: orderType,
          quantity: numShares,
          price: instructionType === "limit" ? orderPrice : stock.lastTrade,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      alert("Order submitted!");
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to submit order.");
    }

    resetForm();
  };

  return (
    <>
      <Header user={username} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleOrderSubmit}>
          <Paper elevation={2}>
            <StockCard
              stock={stock}
              isWatchlisted={watchlist.includes(stock.symbol)}
              onToggleWatchlist={fetchWatchlist}
            />
          </Paper>
          <Paper elevation={2}>
            <p>Action</p>
            <ToggleButtonGroup
              color="info" // just playing ard
              value={orderType}
              exclusive
              onChange={handleOrderChange}
              aria-label="text alignment"
            >
              <ToggleButton value="buy" aria-label="left aligned">
                Buy
              </ToggleButton>
              <ToggleButton value="sell" aria-label="right aligned">
                Sell
              </ToggleButton>
              <TextField
                id="numShares"
                label="Number of Shares"
                type="number"
                value={numShares}
                onChange={handleNumSharesChange}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </ToggleButtonGroup>
          </Paper>
          <Paper elevation={2}>
            <p>Instructions</p>
            <ToggleButtonGroup
              color="info"
              value={instructionType}
              exclusive
              onChange={handleInstructionChange}
              aria-label="text alignment"
            >
              <ToggleButton value="limit" aria-label="left aligned">
                Limit
              </ToggleButton>
              <ToggleButton value="market" aria-label="right aligned">
                At Market Price
              </ToggleButton>
            </ToggleButtonGroup>
            {instructionType === "limit" && (
              <TextField
                id="limit-price"
                label="Price"
                type="number"
                value={orderPrice}
                onChange={handlePriceChange}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
          </Paper>
          <Paper elevation={2}>
            <p>Expiry</p>
            <ToggleButtonGroup
              color="info"
              value={expiryType}
              exclusive
              onChange={handleExpiryChange}
              aria-label="text alignment"
            >
              <ToggleButton value="gtc" aria-label="left aligned">
                GTC
              </ToggleButton>
              <ToggleButton value="day" aria-label="right aligned">
                Day Only
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
          <Button variant="contained" type="submit">
            Submit Order Ticket
          </Button>
        </form>
      </div>
    </>
  );
}

export default OrderPage;
