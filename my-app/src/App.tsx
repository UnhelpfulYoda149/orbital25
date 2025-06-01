import React from "react";
import { useState, useEffect, MouseEvent } from "react";
import Header from "./components/Header";
import "./App.css";
import Login from "./components/Login";
import OrderPage from "./pages/OrderPage";
import { Stock } from "./types";
import StockCard from "./components/StockCard";
import PortfolioPage from "./pages/PortfolioPage";
import LoginPage from "./pages/LoginPage";
import { createClient, Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import DashboardPage from "./pages/DashboardPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import NavBar from "./components/Navbar";
import { ToggleButton } from "@mui/material";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export const supabase = createClient(
  "https://eaotlxhwxspeozxjexnv.supabase.co",
  process.env.REACT_APP_SUPABASE_KEY!
);

type Page = "login" | "dashboard" | "order" | "portfolio";

function App() {
  const [session, setSession] = useState<Session | null>();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [page, setPage] = useState<Page>("portfolio");

  function NavBar() {
    return (
      <ToggleButtonGroup
        color="info" // just playing ard
        value={page}
        exclusive
        onChange={handlePageChange}
        aria-label="text alignment"
      >
        <ToggleButton value="dashboard" aria-label="left aligned">
          Dashboard
        </ToggleButton>
        <ToggleButton value="order" aria-label="centered">
          Order
        </ToggleButton>
        <ToggleButton value="portfolio" aria-label="right aligned">
          Portfolio
        </ToggleButton>
      </ToggleButtonGroup>
    );
  }

  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase.from("Stocks").select();
      if (error) {
        return [];
      }
      const stocksArr: Stock[] = data;
      return stocksArr;
    };

    loadData().then((stocks) => setStocks(stocks));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePageChange = (
    event: MouseEvent<HTMLElement>,
    newPageType: Page
  ) => {
    if (newPageType !== null) {
      setPage(newPageType);
    }
  };

  if (!session || page == "login") {
    return (
      <>
        <Header user="" />
        <LoginPage />
      </>
    );
  } else if (page == "dashboard") {
    return (
      <>
        <Header user={", " + session.user.email || ""} />
        <NavBar />
        <DashboardPage stocksInput={stocks} />
      </>
    );
  } else if (page == "order") {
    return (
      <>
        <Header user={", " + session.user.email || ""} />
        <NavBar />
        <OrderPage stocksInput={stocks} />
      </>
    );
  } else {
    return (
      <>
        <Header user={", " + session.user.email || ""} />
        <NavBar />
        <PortfolioPage />
      </>
    );
  }
}

export default App;
