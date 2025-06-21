import "../styles/TransactionCard.css";

type TransactionCardProps = {
  action: string;
  stock: string;
  quantity: number;
  price: number;
  timestamp: string;
  realizedPnl?: number;
};

function TransactionCard({
  action,
  stock,
  quantity,
  price,
  timestamp,
  realizedPnl,
}: TransactionCardProps) {
  return (
    <div className="transaction-card">
      <h3>{stock} - {action.toUpperCase()}</h3>
      <p>Quantity: {quantity}</p>
      <p>Price: ${price.toFixed(2)}</p>
      <p>Time: {new Date(timestamp).toLocaleString()}</p>
      {realizedPnl !== null && realizedPnl !== undefined && (
        <p>Realized P&L: ${realizedPnl.toFixed(2)}</p>
      )}
    </div>
  );
}

export default TransactionCard;
