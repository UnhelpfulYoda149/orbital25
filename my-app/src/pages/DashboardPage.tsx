import StockCard from "../components/StockCard";
import { Stock } from "../types";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";

export default function DashboardPage() {
  const username = localStorage.getItem("username");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    try {
      const res = await api.get("/user/watchlist/", { withCredentials: true });
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

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      const res = await api.get(`/search-stock/?query=${search}`, {
        withCredentials: true,
      });
      const basicResults: Stock[] = res.data;

      // Fetch full LiveStock info for each search result
      const promises = basicResults.map((stock) =>
        api.post(
          "/live-stock-request/",
          { symbol: stock.symbol },
          { withCredentials: true }
        )
      );
      const detailedRes = await Promise.all(promises);
      const detailedStocks = detailedRes.map((r) => r.data);
      setResults(detailedStocks);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <>
      <Header user={username} />
      <div style={{ padding: "1rem", maxWidth: "1000px", margin: "auto" }}>
        <h1>Dashboard</h1>
        <h2>Search</h2>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <TextField
            label="Search Stocks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKey}
            style={{ marginRight: "0.5rem" }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
        {results.length > 0 && (
          <>
            <h2>Search Results</h2>
            <Grid container direction="column" spacing={1}>
              {results.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  isWatchlisted={watchlist.includes(stock.symbol)}
                  onToggleWatchlist={fetchWatchlist}
                />
              ))}
            </Grid>
          </>
        )}
        <h2>Watchlist</h2>
        {watchlist.length == 0 && <h3>Your Watchlist is empty :(</h3>}

        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            isWatchlisted={watchlist.includes(stock.symbol)}
            onToggleWatchlist={fetchWatchlist}
          />
        ))}
      </div>
    </>
  );
}
