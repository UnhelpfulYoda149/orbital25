import "../styles/TransactionCard.css";

type TransactionProps = {
  id: number;
  action: string;
  quantity: number;
  price: number;
  timestamp: string;
  realized_pnl: number | null;
  stock_name: string;
  stock_symbol: string;
};

function TransactionCard({
  action,
  quantity,
  price,
  timestamp,
  realized_pnl,
  stock_name,
  stock_symbol,
}: TransactionProps) {
  const date = new Date(timestamp).toLocaleString();
  const isBuy = action === "buy";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        backgroundColor: isBuy ? "#D1FFBD" : "#FFC2C2",
      }}
    >
      <h3 style={{ margin: "0", fontWeight: "bold" }}>{isBuy ? "Buy" : "Sell"}</h3>
      <p style={{ marginTop: "0.2rem", marginBottom: "1rem"}}>
        {stock_name} ({stock_symbol})
      </p>
      <p><strong>Quantity:</strong> {quantity}</p>
      <p><strong>Price:</strong> ${price.toFixed(2)}</p>
      <p><strong>Date:</strong> {date}</p>
      {realized_pnl !== null && (
        <p><strong>Realized P&L:</strong> ${realized_pnl.toFixed(2)}</p>
      )}
    </div>
  );
}

export default TransactionCard;

