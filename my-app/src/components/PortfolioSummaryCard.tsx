import { PortfolioSummary } from "../types";

type Props = {
  cash: number;
  stocks: PortfolioSummary[];
  reservedCash: number;
};

function PortfolioSummaryCard({ cash, stocks, reservedCash }: Props) {
  const stockValue = stocks.reduce(
    (acc, cur) => acc + cur.stock.lastTrade * cur.quantity,
    0
  );
  const variance = stocks.reduce(
    (acc, cur) =>
      acc +
      ((cur.stock.lastTrade * cur.quantity) / stockValue) ** 2 * cur.stock.var,
    0
  );
  const totalCostBasis = stocks.reduce(
    (acc, cur) => acc + cur.averagePrice * cur.quantity,
    0
  );
  const tdyChange = stocks.reduce(
    (acc, cur) => acc + cur.quantity * (cur.stock.lastTrade - cur.stock.open),
    0
  );
  const tdyColor = tdyChange >= 0 ? "green" : "red";
  const tdyPrefix = tdyChange >= 0 ? "+" : "-";
  const unrealizedPnL = stockValue - totalCostBasis;
  const pnlColor = unrealizedPnL >= 0 ? "green" : "red";
  const pnlPrefix = unrealizedPnL >= 0 ? "+" : "-";
  const pnlPercentage =
    totalCostBasis > 0
      ? ((unrealizedPnL / totalCostBasis) * 100).toFixed(2)
      : "0.00";

  const totalValue = cash + reservedCash + stockValue;

  const realizedPnl = totalValue - unrealizedPnL - 10000;
  const rpnlColor = realizedPnl >= 0 ? "green" : "red";
  const rpnlPrefix = realizedPnl >= 0 ? "+" : "-";

  return (
    <div
      style={{
        marginBottom: "2rem",
        padding: "1.5rem",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Total Portfolio Value: ${totalValue.toFixed(2)}
      </h1>

      <p>
        <strong>Buying Power (Cash):</strong> ${cash.toFixed(2)}{" "}
        <span style={{ color: "#888" }}>
          (+${reservedCash.toFixed(2)} reserved)
        </span>
      </p>

      <p>
        <strong>Stock Holdings Value:</strong> ${stockValue.toFixed(2)}
      </p>
      <p>
        <strong>Total Unrealized P&L:</strong>{" "}
        <span style={{ color: pnlColor, fontWeight: "bold" }}>
          {pnlPrefix}${Math.abs(unrealizedPnL).toFixed(2)} ({pnlPrefix}
          {pnlPercentage}%)
        </span>
      </p>
      <p>
        <strong>Total Realized P&L:</strong>{" "}
        <span style={{ color: rpnlColor, fontWeight: "bold" }}>
          {rpnlPrefix}${Math.abs(realizedPnl).toFixed(2)}
        </span>
      </p>
      <p>
        <strong>Today's Change:</strong>{" "}
        <span style={{ color: tdyColor, fontWeight: "bold" }}>
          {tdyPrefix}${Math.abs(tdyChange).toFixed(2)}
        </span>
      </p>
      <p>
        <strong>Portfolio Variance</strong>{" "}
        <span style={{ fontWeight: "bold" }}>{variance.toFixed(2)}</span>
      </p>
    </div>
  );
}

export default PortfolioSummaryCard;
