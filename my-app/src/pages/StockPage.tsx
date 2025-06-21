import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Stock } from "../types";
import { Card, Grid, Box } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function StockPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const stock: Stock = location.state.stock;
  const upArrow = "/uparrow.png";

  const handleClick = (stock: Stock) => {
    navigate("/order", {
      state: {
        stock: stock,
      },
    });
  };

  return (
    <>
      <Header user={username} />
      <Card variant="outlined">
        <CardContent>
          <Grid container direction="row" alignItems="center" spacing={2}>
            <Typography variant="h3">{stock.name}</Typography>
            <Typography variant="h4">({stock.symbol})</Typography>
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={1}
            marginTop={2}
          >
            <Box
              component="img"
              src={
                process.env.PUBLIC_URL +
                (stock.lastTrade - stock.open > 0
                  ? "/uparrow.png"
                  : "/downarrow.png")
              }
              sx={{ height: "1vw" }}
            />
            <Typography variant="body1">${stock.lastTrade}</Typography>
            <Typography variant="body1">
              {(((stock.lastTrade - stock.open) / stock.open) * 100).toFixed(2)}
              %
            </Typography>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default StockPage;
