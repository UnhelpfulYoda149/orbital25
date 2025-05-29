import React from "react";
import Header from "./components/Header";
import "./App.css";
import Login from "./components/Login";

function App() {
  return (
    <>
      <Header user="admin" />
      <main className="App-body">
        <Login />
      </main>
    </>
  );
}

export default App;
