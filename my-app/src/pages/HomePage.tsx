import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../api";
import { PostCardProps } from "../components/PostCard";
import PostCard from "../components/PostCard";

function HomePage() {
  const username = localStorage.getItem("username");
  const [props, setProps] = useState<PostCardProps[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const fetchFeed = async () => {
    try {
      const res = await api.get("/user/feed/", { withCredentials: true });
      console.log(res);
      const updatedData = res.data.map(
        (item: {
          user: { username: string };
          transaction: {
            action: string;
            price: number;
            quantity: number;
            timestamp: string;
            stock_symbol: string;
          };
        }) => {
          console.log(watchlist);
          return {
            username: item.user.username,
            action: item.transaction.action,
            price: item.transaction.price,
            quantity: item.transaction.quantity,
            symbol: item.transaction.stock_symbol,
            timestamp: item.transaction.timestamp,
          };
        }
      );
      setProps(updatedData);
    } catch (err) {
      console.error("Problem retrieving user feed", err);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const res = await api.get("/user/watchlist/");
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
              {...prop}
              onToggleWatchlist={fetchWatchlist}
              isWatchlisted={watchlist.includes(prop.symbol)}
            />
          ))
        )}
      </div>
    </>
  );
}

export default HomePage;
