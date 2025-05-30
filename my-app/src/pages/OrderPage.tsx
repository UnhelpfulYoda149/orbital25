import { Stock, StockNames } from "../types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { MouseEvent, useState, ChangeEvent, FormEvent } from "react";
import Paper from "@mui/material/Paper";
import { flexDirection } from "@mui/system";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";

interface OrderPageProps {
  stock: Stock;
}

type Order = "buy" | "sell";
type Instruction = "market" | "limit";
type Expiry = "gtc" | "day";

const StockList = [
  { id: "APPL", name: "APPLE INC" },
  { id: "GOOG", name: "ALPHABET INC" },
];

function OrderPage({ stock }: OrderPageProps) {
  const [orderType, setOrderType] = useState<Order>("buy");
  const [instructionType, setInstructionType] = useState<Instruction>("limit");
  const [expiryType, setExpiryType] = useState<Expiry>("gtc");
  const [orderPrice, setOrderPrice] = useState<number | null>(null);
  const [stockName, setStockName] = useState<StockNames>(StockList[0]);
  const { id, lastTradePrice, openPrice } = stock;

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

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) {
      setOrderPrice(num);
    }
  };

  const defaultProps = {
    // options: OptionsList (get from database)
    options: StockList,
    getOptionLabel: (option: StockNames) => option.id + ": " + option.name,
  };

  const handleOrderSubmit = (e: FormEvent<HTMLFormElement>) => {
    // handle orders with database
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
            onChange={(event: any, newValue: StockNames) => {
              setStockName(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Stock" variant="standard" />
            )}
          />
          {stockName.id + ": " + stockName.name}
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
          </ToggleButtonGroup>
          <p>Checking: {orderType}</p>
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
          <p>Checking: {instructionType}</p>
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
          <p>Checking: {expiryType}</p>
        </Paper>
        <Button variant="contained" type="submit">
          Submit Order Ticket
        </Button>
      </form>
    </div>
  );
}

export default OrderPage;
