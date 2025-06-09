import React from "react";
import { useState, useEffect, MouseEvent } from "react";
import Header from "./components/Header";
import "./App.css";
import OrderPage from "./pages/OrderPage";
import { Stock } from "./types";
import PortfolioPage from "./pages/PortfolioPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { createClient, Session } from "@supabase/supabase-js";
import DashboardPage from "./pages/DashboardPage";
import { Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import { useNavigate } from "react-router-dom";

export const supabase = createClient(
  "https://eaotlxhwxspeozxjexnv.supabase.co",
  process.env.REACT_APP_SUPABASE_KEY!
);

// type Page = "login" | "dashboard" | "order" | "portfolio";

export const loadAllStockData = async () => {
  const { data, error } = await supabase.from("Stocks").select();
  if (error) {
    return [];
  }
  const stocksArr: Stock[] = data;
  return stocksArr;
};

function App() {
  const [session, setSession] = useState<Session | null>();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  // const [page, setPage] = useState<Page>("dashboard");

  useEffect(() => {
    loadAllStockData().then((stocks) => setStocks(stocks));
  }, []);

  useEffect(() => {
    // get Session data (if any)
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

  // const handlePageChange = (
  //   event: MouseEvent<HTMLElement>,
  //   newPageType: Page
  // ) => {
  //   if (newPageType !== null) {
  //     setPage(newPageType);
  //   }
  // };

  if (!session) {
    navigate("/login");
  }

  return (
    <>
      <Header user={session ? ", " + session.user.email : ""} />

      {session && <NavBar />}
      <Routes>
        <Route path="login" element={<LoginPage />} />
        {session && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/order" element={<OrderPage />} />
          </>
        )}
      </Routes>
    </>
  );

  // if (!session || page == "login") {
  //   return (
  //     <>
  //       <Header user="" />
  //       <LoginPage />
  //     </>
  //   );
  // } else if (page == "dashboard") {
  //   return (
  //     <>
  //       <Header user={", " + session.user.email || ""} />
  //       <NavBar />
  //       <DashboardPage />
  //     </>
  //   );
  // } else if (page == "order") {
  //   return (
  //     <>
  //       <Header user={", " + session.user.email || ""} />
  //       <NavBar />
  //       <OrderPage />
  //     </>
  //   );
  // } else {
  //   return (
  //     <>
  //       <Header user={", " + session.user.email || ""} />
  //       <NavBar />
  //       <PortfolioPage />
  //     </>
  //   );
  // }
}

export default App;
