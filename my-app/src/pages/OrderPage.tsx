import { Stock } from "../types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { MouseEvent, useState, useEffect, ChangeEvent, FormEvent } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { supabase } from "../App";
import StockCard from "../components/StockCard";
import { loadAllStockData } from "../App";

interface OrderPageProps {
  initStock?: Stock;
}

type Order = "buy" | "sell";
type Instruction = "market" | "limit";
type Expiry = "gtc" | "day";

function OrderPage({ initStock }: OrderPageProps) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [orderType, setOrderType] = useState<Order>("buy");
  const [instructionType, setInstructionType] = useState<Instruction>("limit");
  const [expiryType, setExpiryType] = useState<Expiry>("gtc");
  const [numShares, setNumShares] = useState<number>(0);
  const [orderPrice, setOrderPrice] = useState<number>(0);
  const [stockName, setStockName] = useState<Stock>(
    initStock ? initStock : stocks[0]
  );

  useEffect(() => {
    const fetchData = async () => {
      loadAllStockData().then((r) => {
        setStocks(r);
        setStockName(r[0]);
      });
    };
    fetchData();
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
    console.log(numShares);
    const data = {
      user_id: await supabase.auth
        .getSession()
        .then((val) => val.data.session?.user.id),
      stock_id: stockName.id,
      numShares: numShares,
      purchasePrice: stockName.lastTradePrice,
    };
    if (orderType == "buy") {
      const { error } = await supabase.from("Holdings").insert(data);
      if (error) {
        console.log(error);
      }
    } else {
      const sellData = { ...data, numShares: -1 * numShares };
      const { error } = await supabase.from("Holdings").insert(sellData);
      if (error) {
        console.log(error);
      }
    }
    //Reset to default form inputs
    resetForm();
  };

  const defaultProps = {
    options: stocks,
    getOptionLabel: (option: Stock) => option.id + ": " + option.name,
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
          {stockName && (
            <>
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
            </>
          )}
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
  );
}

export default OrderPage;
