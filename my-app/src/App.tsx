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

console.log(process.env.REACT_APP_SUPABASE_KEY);

type Page = "login" | "order" | "dashboard" | "portfolio";

export const supabase = createClient(
  "https://eaotlxhwxspeozxjexnv.supabase.co",
  process.env.REACT_APP_SUPABASE_KEY!
);

function App() {
  const [session, setSession] = useState<Session | null>();
  const [page, setPage] = useState<Page>("dashboard");

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
  } else if (page == "dashboard") {
    return (
      <>
        <Header user={session.user.email || ""} />
        <DashboardPage />
      </>
    );
  } else if (page == "order") {
    return (
      <>
        <Header user={session.user.email || ""} />
        <DashboardPage />
      </>
    );
  } else {
    return (
      <>
        <Header user={session.user.email || ""} />
        <DashboardPage />
      </>
    );
  }
}

export default App;
