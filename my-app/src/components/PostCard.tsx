import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  IconButton,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Stock } from "../types";
import api from "../api";
import StockCard from "./StockCard";
import { useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import ProfileCard from "./ProfileCard";

export interface PostCardProps {
  id: number;
  username: string;
  action: string;
  price: number;
  quantity: number;
  symbol: string;
  timestamp: string;
  isWatchlisted: boolean;
  comments_count: number;
  likes_count: number;
  isLiked: boolean;
  comments: any[];
  onToggleWatchlist: () => void;
  toggleLike: (id: number) => void;
  handleCommentSubmit: () => void;
}

function PostCard({
  id,
  username,
  action,
  price,
  quantity,
  symbol,
  timestamp,
  isWatchlisted,
  likes_count,
  comments_count,
  isLiked,
  comments,
  onToggleWatchlist,
  toggleLike,
  handleCommentSubmit,
}: PostCardProps) {
  const date = new Date(timestamp).toLocaleString();
  const isBuy = action === "buy";
  const [stock, setStock] = useState<Stock>();
  const [editingComment, setEditingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  const fetchStock = async () => {
    try {
      const res = await api.post(
        "/live-stock-request/",
        { symbol: symbol },
        { withCredentials: true }
      );
      setStock(res.data);
    } catch (err) {
      console.error("Error fetching stock data", err);
    }
  };

  const handleComment = async (comment: string, id: number) => {
    try {
      await api.post(
        "/user/post-comment/",
        { comment: comment, id: id },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const handleClick = (stock: Stock) => {
    navigate("/stock", { state: { stock } });
  };

  const resetComment = () => {
    setEditingComment(false);
    setNewComment("");
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <Card
      variant="elevation"
      sx={{
        minWidth: 500,
        position: "relative",
        marginTop: 3,
        backgroundColor: isBuy ? "#D1FFBD" : "#FFC2C2",
      }}
    >
      <CardContent>
        <Typography variant="h5">
          {username + (isBuy ? " bought" : " sold")}
        </Typography>
        <Typography variant="body1">{`${quantity} units of ${symbol} @ $${price.toFixed(
          2
        )}`}</Typography>
        {stock && (
          <StockCard
            isWatchlisted={isWatchlisted}
            stock={stock}
            onToggleWatchlist={onToggleWatchlist}
          />
        )}
        <Typography variant="body2">{date}</Typography>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent={"space-evenly"}
        >
          <Grid container direction="row" alignItems="center" gap={0.5}>
            <IconButton
              onClick={() => {
                toggleLike(id);
              }}
            >
              <ThumbUpIcon color={isLiked ? "primary" : "action"} />
            </IconButton>
            <Typography variant="body2">{likes_count}</Typography>
          </Grid>
          <Grid container direction="row" alignItems="center" gap={0.5}>
            <IconButton
              onClick={() => {
                setEditingComment(true);
              }}
            >
              <CommentIcon />
            </IconButton>
            <Typography variant="body2">{comments_count}</Typography>
          </Grid>
        </Grid>
        {editingComment ? (
          <>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div style={{ marginTop: "0.5rem" }}>
              <Button
                onClick={() => {
                  handleComment(newComment, id);
                  handleCommentSubmit();
                  resetComment();
                }}
              >
                Comment
              </Button>
              <Button onClick={resetComment} color="secondary" sx={{ ml: 1 }}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
        {comments.map((item) => (
          <Card
            variant="elevation"
            key={item.id}
            sx={{
              minWidth: 500,
              position: "relative",
              marginTop: 1,
              padding: 1,
              backgroundColor: isBuy ? "#D1FFBD" : "#FFC2C2",
            }}
          >
            <Grid container direction="row" alignItems="center" spacing={2}>
              <ProfileCard
                username={item.user.username}
                bgcolor={isBuy ? "#D1FFBD" : "#FFC2C2"}
              />
              <Typography variant="body1">{item.text}</Typography>
              <Typography
                variant="body2"
                position="absolute"
                right={20}
                bottom={5}
              >
                {new Date(item.timestamp).toLocaleString()}
              </Typography>
            </Grid>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

export default PostCard;
