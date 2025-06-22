import { useEffect, useState } from "react";
import TransactionCard from "../components/TransactionCard";
import api from "../api";
import Header from "../components/Header";

type Transaction = {
  id: number;
  action: string;
  quantity: number;
  price: number;
  timestamp: string;
  realized_pnl: number | null;
  stock_name: string;
  stock_symbol: string;
};

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/user/transactions/");
        // Sort by timestamp DESC
        const sorted = res.data.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setTransactions(sorted);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <>
      <Header user={username} />
      <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
        <h2>Your Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map((tx) => <TransactionCard key={tx.id} {...tx} />)
        )}
      </div>
    </>
  );
}

export default TransactionsPage;
