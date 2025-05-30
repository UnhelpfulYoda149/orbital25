import React from "react";
import Header from "./components/Header";
import "./App.css";
import Login from "./components/Login";
import OrderPage from "./pages/OrderPage";
import { Stock } from "./types";
import StockCard from "./components/StockCard";
import PortfolioPage from "./pages/PortfolioPage";

const goog: Stock = { id: "GOOG", lastTradePrice: 1.0, openPrice: 0.95 };
const app: Stock = { id: "APPL", lastTradePrice: 5.03, openPrice: 5.05 };
const nvidia: Stock = { id: "NVDA", lastTradePrice: 139.1, openPrice: 142 };
const portfolio: Stock[] = [goog, app, nvidia];

function App() {
  return (
    <>
      <Header user="admin" />
      <main className="App-body">
        <PortfolioPage stocks={portfolio} />
      </main>
    </>
  );
}

export default App;
