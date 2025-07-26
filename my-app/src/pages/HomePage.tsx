import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api";
import { PostCardProps } from "../components/PostCard";
import PostCard from "../components/PostCard";

function HomePage() {
  const username = localStorage.getItem("username");
  const [props, setProps] = useState<PostCardProps[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const toggleLike = async (id: number) => {
    try {
      const res = await api.post(
        "/toggle-post-like/",
        { id: id },
        { withCredentials: true }
      );
      fetchFeed();
    } catch (err) {
      console.error("Error toggling like on post", err);
    }
  };

  const fetchFeed = async () => {
    try {
      const res = await api.get("/user/feed/", { withCredentials: true });

      const updatedData = res.data.map((item: any) => {
        return {
          id: item.id,
          username: item.user.username,
          action: item.transaction.action,
          price: item.transaction.price,
          quantity: item.transaction.quantity,
          symbol: item.transaction.stock_symbol,
          timestamp: item.transaction.timestamp,
          isLiked: item.isLiked,
          likes_count: item.likes_count,
          comments_count: item.comments_count,
          comments: item.comments,
        };
      });
      setProps(updatedData);
    } catch (err) {
      console.error("Problem retrieving user feed", err);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const res = await api.get("/user/watchlist/", { withCredentials: true });
      const symbols: string[] = res.data.map((item: any) => item.stock);
      setWatchlist(symbols);
    } catch (err) {
      console.error("Failed to fetch watchlist", err);
    }
  };

  useEffect(() => {
    fetchWatchlist();
    fetchFeed();
  }, []);

  return (
    <>
      <Header user={username} />

      <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
        <h2>Activity Feed</h2>
        {props.length === 0 ? (
          <h3>No feed yet...</h3>
        ) : (
          props.map((prop) => (
            <PostCard
              key={prop.id}
              {...prop}
              onToggleWatchlist={fetchWatchlist}
              isWatchlisted={watchlist.includes(prop.symbol)}
              toggleLike={() => toggleLike(prop.id)}
              handleCommentSubmit={() => fetchFeed()}
            />
          ))
        )}
      </div>
    </>
  );
}

export default HomePage;
