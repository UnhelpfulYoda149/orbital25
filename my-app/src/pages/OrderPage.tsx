import { Stock } from "../types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { MouseEvent, useState, useEffect, ChangeEvent, FormEvent } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import StockCard from "../components/StockCard";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { Order, Instruction, Expiry } from "../types";
import api from "../api";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function OrderPage() {
  const location = useLocation();
  const username = localStorage.getItem("username");
  const [orderType, setOrderType] = useState<Order>("buy");
  const [instructionType, setInstructionType] = useState<Instruction>("limit");
  const [expiryType, setExpiryType] = useState<Expiry>("gtc");
  const [numShares, setNumShares] = useState<number>(1); 
  const [orderPrice, setOrderPrice] = useState<number>(0);
  const [error, setError] = useState<string>(""); 
  const [portfolioQty, setPortfolioQty] = useState<number>(0); 
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const stock: Stock = location.state.stock;

  const fetchPortfolio = async () => {
    try {
      const res = await api.get("/portfolio-request/", {
        withCredentials: true,
      });
      const match = res.data.find((item: any) => item.stock === stock.symbol);
      setPortfolioQty(match ? match.quantity : 0);
    } catch (err) {
      console.error("Failed to fetch portfolio", err);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    setOrderPrice(Number(stock.lastTrade.toFixed(2))); 
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await api.get("/user/watchlist/");
      console.log(res);
      const symbols: string[] = res.data.map((item: any) => item.stock);
      setWatchlist(symbols);

      const promises = symbols.map((symbol) =>
        api.post(
          "/live-stock-request/",
          { symbol: symbol },
          { withCredentials: true }
        )
      );

      const detailedRes = await Promise.all(promises);
      const detailedStocks = detailedRes.map((r) => r.data);
      setStocks(detailedStocks);
    } catch (err) {
      console.error("Failed to fetch watchlist", err);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleOrderChange = (_: MouseEvent<HTMLElement>, newOrderType: Order) => {
    if (newOrderType !== null) {
      setOrderType(newOrderType);
      setError("");
    }
  };

  const handleInstructionChange = (_: MouseEvent<HTMLElement>, newType: Instruction) => {
    if (newType !== null) {
      setInstructionType(newType);
    }
  };

  const handleExpiryChange = (_: MouseEvent<HTMLElement>, newType: Expiry) => {
    if (newType !== null) {
      setExpiryType(newType);
    }
  };

  const handleNumSharesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) {
      setNumShares(num);
    }
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) {
      setOrderPrice(num);
    }
  };

  const resetForm = () => {
    setNumShares(1);
    setOrderPrice(Number(stock.lastTrade.toFixed(2)));
    setExpiryType("gtc");
    setInstructionType("limit");
    setOrderType("buy");
    setError("");
  };

  const handleOrderSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (numShares <= 0) {
      setError("Number of shares must be greater than 0.");
      return;
    }

    if (orderType === "sell" && numShares > portfolioQty) {
      setError("You cannot sell more shares than you currently own.");
      return;
    }

    try {
      const res = await api.post(
        "/place-order/",
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
      resetForm();
      fetchPortfolio();
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to submit order.");
    }
  };

  return (
    <>
      <Header user={username} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <form onSubmit={handleOrderSubmit} style={{ width: "100%", maxWidth: "600px" }}>
          <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
            <StockCard
              stock={stock}
              isWatchlisted={watchlist.includes(stock.symbol)}
              onToggleWatchlist={fetchWatchlist}
            />
            <Typography variant="body2" color="text.secondary">
              You currently hold: <strong>{portfolioQty}</strong> shares of {stock.symbol}
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">Action</Typography>
            <Box display="flex" gap={2} alignItems="center">
              <ToggleButtonGroup value={orderType} exclusive onChange={handleOrderChange}>
                <ToggleButton value="buy">Buy</ToggleButton>
                <ToggleButton value="sell">Sell</ToggleButton>
              </ToggleButtonGroup>
              <TextField
                label="Number of Shares"
                type="number"
                inputProps={{ min: 1 }}
                value={numShares}
                onChange={handleNumSharesChange}
                size="small"
              />
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">Instructions</Typography>
            <Box display="flex" gap={2} alignItems="center">
              <ToggleButtonGroup
                value={instructionType}
                exclusive
                onChange={handleInstructionChange}
              >
                <ToggleButton value="limit">Limit</ToggleButton>
                <ToggleButton value="market">At Market</ToggleButton>
              </ToggleButtonGroup>
              {instructionType === "limit" && (
                <TextField
                  label="Price"
                  type="number"
                  inputProps={{ step: 0.01 }}
                  value={orderPrice}
                  onChange={handlePriceChange}
                  size="small"
                />
              )}
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">Expiry</Typography>
            <ToggleButtonGroup
              value={expiryType}
              exclusive
              onChange={handleExpiryChange}
            >
              <ToggleButton value="gtc">GTC</ToggleButton>
              <ToggleButton value="day">Day Only</ToggleButton>
            </ToggleButtonGroup>
          </Paper>

          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}

          <Button variant="contained" type="submit" fullWidth>
            Submit Order
          </Button>
        </form>
      </div>
    </>
  );
}

export default OrderPage;
