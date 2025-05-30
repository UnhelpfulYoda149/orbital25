import { Stock } from "../types";
import StockCard from "../components/StockCard";

interface PortfolioPageProps {
  stocks: Stock[];
}

function PortfolioPage({ stocks }: PortfolioPageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {stocks.map((portfolioStock) => {
        return <StockCard stock={portfolioStock}></StockCard>;
      })}
    </div>
  );
}

export default PortfolioPage;
