import React from "react";
import { useState, useEffect, MouseEvent } from "react";
import "./App.css";
import { Stock } from "./types";
import { createClient, Session } from "@supabase/supabase-js";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Header from "./components/Header";
import NavBar from "./components/NavBar";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/DashboardPage";
import PortfolioPage from "./pages/PortfolioPage";
import OrderPage from "./pages/OrderPage";
import StockPage from "./pages/StockPage";
import TransactionsPage from "./pages/TransactionsPage";
import FriendPage from "./pages/FriendPage";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <RegisterPage />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <PortfolioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order"
        element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock"
        element={
          <ProtectedRoute>
            <StockPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <FriendPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<RegisterAndLogout />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

/*
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
}
*/
export default App;
