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

export default function DashboardPage() {
  const username = localStorage.getItem("username");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const navigate = useNavigate();

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

  const handleClick = (stock: Stock) => {
    navigate("/stock", { state: { stock } });
  };

  const handleSearch = async () => {
    try {
      const res = await api.get(`/search-stock/?query=${search}`);
      const basicResults: Stock[] = res.data;

      // Fetch full LiveStock info for each search result
      const promises = basicResults.map((stock) =>
        api.post("/live-stock-request/", { symbol: stock.symbol })
      );
      const detailedRes = await Promise.all(promises);
      const detailedStocks = detailedRes.map((r) => r.data);

      setResults(detailedStocks);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div>
      <Header user={username} />
      <h1>Dashboard</h1>

      <div style={{ marginBottom: "1rem" }}>
        <TextField
          label="Search Stocks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {results.length > 0 && (
        <>
          <h2>Search Results</h2>
          <div className="grid grid-cols-2 gap-4">
            {results.map((stock) => (
              <Card key={stock.symbol} variant="outlined">
                <CardActionArea onClick={() => handleClick(stock)}>
                  <StockCard
                    stock={stock}
                    isWatchlisted={watchlist.includes(stock.symbol)}
                    onToggleWatchlist={fetchWatchlist}
                  />
                </CardActionArea>
              </Card>
            ))}
          </div>
        </>
      )}
      <h2>Watchlist</h2>
      {watchlist.length == 0 && <h3>Your Watchlist is empty :(</h3>}
      <div className="grid grid-cols-2 gap-4">
        {stocks.map((stock) => (
          <Card key={stock.symbol} variant="outlined">
            <CardActionArea onClick={() => handleClick(stock)}>
              <StockCard
                stock={stock}
                isWatchlisted={watchlist.includes(stock.symbol)}
                onToggleWatchlist={fetchWatchlist}
              />
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  );
}
