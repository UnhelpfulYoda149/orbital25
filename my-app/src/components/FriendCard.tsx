import { Friend } from "../types";
import { Card, Grid, Button } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import StockChange from "./StockChange";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState, useEffect } from "react";
import api from "../api";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface FriendCardProps {
  username: string;
  requested: boolean;
}

function FriendCard({ username, requested }: FriendCardProps) {
  const handleClick = async () => {
    try {
      const res = await api.post(
        "/send-friend-request/",
        { username: username },
        { withCredentials: true }
      );
      console.log(res);
    } catch (err) {
      console.error("Unable to send friend request", err);
    }
  };

  return (
    <Card variant="outlined" sx={{ minWidth: 500, position: "relative" }}>
      <CardContent>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5">{username}</Typography>
          <div style={{ position: "absolute", right: 50 }}>
            {!requested ? (
              <Button variant="contained" onClick={handleClick}>
                Send Request
              </Button>
            ) : (
              <Button onClick={handleClick}>Request Sent</Button>
            )}
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FriendCard;
