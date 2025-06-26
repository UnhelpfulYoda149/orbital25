import { Card, Grid, Button } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import api from "../api";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";

interface FriendCardProps {
  username: string;
  handleClick: (name: string) => void;
}

function FriendCard({ username, handleClick }: FriendCardProps) {
  const [portfolioValue, setPortfolioValue] = useState<number>();
  const getFriendData = async () => {
    try {
      const res = await api.post(
        "/get-friend-data/",
        { username: username },
        { withCredentials: true }
      );
      setPortfolioValue(res.data.portfolio_value);
    } catch (err) {
      console.error("Error fetching friend data", err);
    }
  };

  useEffect(() => {
    getFriendData();
  }, []);

  return (
    <Card variant="outlined" sx={{ minWidth: 500, position: "relative" }}>
      <CardContent>
        <Grid container direction="row" alignItems="center" spacing={3}>
          {username && <ProfileCard username={username} bgcolor="#eeeeee" />}
          <Typography variant="body1">
            Portfolio Value: ${portfolioValue?.toFixed(2)}
          </Typography>
          <div style={{ position: "absolute", right: 50 }}>
            <Button variant="contained" onClick={() => handleClick(username)}>
              Remove Friend
            </Button>
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FriendCard;
