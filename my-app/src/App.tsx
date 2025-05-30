import React from "react";
import Header from "./components/Header";
import "./App.css";
import Login from "./components/Login";
import OrderPage from "./pages/OrderPage";
import { Stock } from "./types";

const test: Stock = { id: "hello", lastTradePrice: 1, openPrice: 1 };

function App() {
  return (
    <>
      <Header user="admin" />
      <main className="App-body">
        <OrderPage stock={test} />
      </main>
    </>
  );
}

export default App;
