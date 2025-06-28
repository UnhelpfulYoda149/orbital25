import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Stock } from "../types";
import { Card, Grid, Box } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import StockChange from "../components/StockChange";

function StockPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const stock: Stock = location.state.stock;

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
      <div style={{ padding: "1rem", maxWidth: "1000px", margin: "auto" }}>
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
              <StockChange
                lastTrade={stock.lastTrade}
                prevClose={stock.close}
              />
            </Grid>
            <Grid
              container
              direction="row"
              alignItems="center"
              spacing={2}
              marginTop={2}
            >
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={0}
              >
                <Typography variant="body1">Open</Typography>
                <Typography variant="body1">
                  ${stock.open !== undefined ? stock.open.toFixed(2) : "N/A"}
                </Typography>
              </Grid>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={0}
              >
                <Typography variant="body1">Previous Close</Typography>
                <Typography variant="body1">
                  ${stock.close !== undefined ? stock.close.toFixed(2) : "N/A"}
                </Typography>
              </Grid>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={0}
              >
                <Typography variant="body1">Day Low</Typography>
                <Typography variant="body1">
                  ${stock.low !== undefined ? stock.low.toFixed(2) : "N/A"}
                </Typography>
              </Grid>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={0}
              >
                <Typography variant="body1">Day High</Typography>
                <Typography variant="body1">
                  ${stock.high !== undefined ? stock.high.toFixed(2) : "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <Button
            variant="contained"
            onClick={() => handleClick(stock)}
            size="small"
            color="primary"
            sx={{ marginLeft: 3, marginBottom: 3 }}
          >
            Order
          </Button>
        </Card>
      </div>
    </>
  );
}

export default StockPage;
