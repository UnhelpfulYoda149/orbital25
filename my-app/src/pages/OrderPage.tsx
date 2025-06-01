import { Stock, StockNames } from "../types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { MouseEvent, useState, ChangeEvent, FormEvent, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { supabase } from "../App";
import StockCard from "../components/StockCard";
// import { useNavigate } from "react-router-dom";

interface OrderPageProps {
  stocksInput: Stock[];
}

type Order = "buy" | "sell";
type Instruction = "market" | "limit";
type Expiry = "gtc" | "day";

function OrderPage({ stocksInput }: OrderPageProps) {
  const stocks = stocksInput;
  const [orderType, setOrderType] = useState<Order>("buy");
  const [instructionType, setInstructionType] = useState<Instruction>("limit");
  const [expiryType, setExpiryType] = useState<Expiry>("gtc");
  const [numShares, setNumShares] = useState<number | null>(null);
  const [orderPrice, setOrderPrice] = useState<number | null>(null);
  const [stockName, setStockName] = useState<Stock>(stocksInput[0]);
  // const navigate = useNavigate();

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
    }
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) {
      setOrderPrice(num);
    }
  };

  const defaultProps = {
    options: stocks,
    getOptionLabel: (option: Stock) => option.id + ": " + option.name,
  };

  const handleOrderSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      user_id: await supabase.auth
        .getSession()
        .then((val) => val.data.session?.user.id),
      stockID: stockName.id,
      numShares: numShares,
      purchasePrice: stockName.lastTradePrice,
    };
    if (orderType == "buy") {
      const { error } = await supabase.from("Holdings").insert(data);
    }
    //Reset to default
    setNumShares(null);
    setOrderPrice(null);
    setExpiryType("gtc");
    setInstructionType("limit");
    setOrderType("buy");
  };

  return (
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
          <Autocomplete
            sx={{ width: 300 }}
            {...defaultProps}
            id="Stock"
            disableClearable
            value={stockName}
            onChange={(event: any, newValue: Stock) => {
              setStockName(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Stock" variant="standard" />
            )}
          />
          <StockCard stock={stockName} />
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
              id="num-shares"
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
            color="info" // just playing ard
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
            color="info" // just playing ard
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
  );
}

export default OrderPage;
