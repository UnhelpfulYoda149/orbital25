import React from "react";
import { useState, useEffect } from "react";
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
import Layout from "./Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

console.log(process.env.REACT_APP_SUPABASE_KEY);

export const supabase = createClient(
  "https://eaotlxhwxspeozxjexnv.supabase.co",
  process.env.REACT_APP_SUPABASE_KEY!
);

function App() {
  const [session, setSession] = useState<Session | null>();
  const [stocks, setStocks] = useState<Stock[]>([]);
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
  // const [page, setPage] = useState<Page>("dashboard");

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

  if (!session) {
    return (
      <>
        <Header user="" />
        <LoginPage />
      </>
    );
  } else {
    return (
      // <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage stocksInput={stocks} />} />
          <Route
            path="/dashboard"
            element={<DashboardPage stocksInput={stocks} />}
          />
          <Route path="/order" element={<OrderPage stocksInput={stocks} />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Route>
      </Routes>
      // </Router>
    );
  }
}

export default App;
