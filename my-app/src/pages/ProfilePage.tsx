import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  TextField,
  Button,
  Container,
} from "@mui/material";
import api from "../api";
import PostCard from "../components/PostCard";
import Header from "../components/Header";
import PortfolioSummaryCard from "../components/PortfolioSummaryCard";
import { PortfolioSummary } from "../types";

function ProfilePage() {
  const { username: paramUsername } = useParams<{ username: string }>();
  const currentUser = localStorage.getItem("username");
  const username = paramUsername || currentUser;
  const isOwnProfile = username === currentUser;

  const [bio, setBio] = useState("");
  const [newBio, setNewBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [friendCount, setFriendCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [isFriend, setIsFriend] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioSummary[]>([]);
  const [portfolioCash, setPortfolioCash] = useState<number>(0);
  const [reservedCash, setReservedCash] = useState(0);
  const [requestSent, setRequestSent] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/user/${username}/profile/`, {
        withCredentials: true,
      });
      setBio(res.data.bio || "");
      setFriendCount(res.data.friend_count);
      setPostCount(res.data.post_count);
      setIsFriend(res.data.is_friend);
      setRequestSent(res.data.request_sent || false);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/user/${username}/posts/`, {
        withCredentials: true,
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

const fetchPortfolioData = async () => {
  try {
    const [portfolioRes, cashRes, ordersRes] = await Promise.all([
      api.get(`/portfolio-request/?user=${username}`, { withCredentials: true }),
      api.get(`/user/${username}/money/`, { withCredentials: true }),
      api.get(`/user/${username}/pending-orders/`, { withCredentials: true }),
    ]);

    const portfolioData = portfolioRes.data;
    const symbols = portfolioData.map((obj: any) => obj.stock);

    const pricesRes = await api.post(
      "/live-stock-batch/",
      { symbols },
      { withCredentials: true }
    );

    const priceMap: Record<string, any> = {};
    for (const item of pricesRes.data) {
      priceMap[item.symbol] = item;
    }

    const stocks = portfolioData.map((obj: any) => ({
      stock: priceMap[obj.stock],
      quantity: obj.quantity,
      averagePrice: obj.average_price,
    }));

    const pendingBuyOrders = ordersRes.data.filter(
      (order: any) => order.action === "buy"
    );

    const reserved = pendingBuyOrders.reduce(
      (sum: number, order: any) => sum + order.price * order.quantity,
      0
    );

    setPortfolioStocks(stocks);
    setPortfolioCash(cashRes.data.money);
    setReservedCash(reserved);

  } catch (err) {
    console.error("Failed to fetch portfolio data", err);
  }
};


  const toggleLike = async (id: number) => {
    try {
      await api.post(
        "/toggle-post-like/",
        { id: id },
        { withCredentials: true }
      );
      fetchPosts();
    } catch (err) {
      console.error("Error toggling like on post", err);
    }
  };

  const handleBioSubmit = async () => {
    try {
      await api.post(
        "/user/update-bio/",
        { bio: newBio },
        { withCredentials: true }
      );
      setBio(newBio);
      setEditingBio(false);
    } catch (err) {
      console.error("Error updating bio:", err);
    }
  };

  const handleFriendRequestToggle = async () => {
    try {
      await api.post(
        "/toggle-friend-request/",
        { username },
        { withCredentials: true }
      );
      setRequestSent(!requestSent);
    } catch (err) {
      console.error("Error toggling friend request", err);
    }
  };

  useEffect(() => {
    if (!username) return;
    fetchProfile();
    fetchPosts();

    if (isOwnProfile || isFriend) {
      fetchPortfolioData();
    }
  }, [username, isFriend]);

  return (
    <>
      <Header user={username || ""} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left Column: Avatar + Bio */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Avatar sx={{ width: 100, height: 100 }}>
                {username?.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Typography variant="h5">@{username}</Typography>
                <Typography>Friends: {friendCount}</Typography>
                <Typography>Posts: {postCount}</Typography>
              </div>
            </div>

            {/* Bio Section */}
            <div style={{ marginTop: "1rem" }}>
              <Typography variant="subtitle1">Bio:</Typography>
              {isOwnProfile ? (
                editingBio ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                    />
                    <div style={{ marginTop: "0.5rem" }}>
                      <Button onClick={handleBioSubmit}>Save</Button>
                      <Button onClick={() => setEditingBio(false)} color="secondary" sx={{ ml: 1 }}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {bio || "No bio yet."}
                    </Typography>
                    <Button
                      onClick={() => {
                        setNewBio(bio);
                        setEditingBio(true);
                      }}
                      sx={{ mt: 1 }}
                    >
                      Edit Bio
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {bio || "No bio yet."}
                  </Typography>
                  {!isFriend && !isOwnProfile && (
                    <Button
                      onClick={handleFriendRequestToggle}
                      variant={requestSent ? "outlined" : "contained"}
                      sx={{ mt: 1 }}
                    >
                      {requestSent ? "Cancel Request" : "Add Friend"}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column: Portfolio Summary */}
          {(isOwnProfile || isFriend) && (
            <div style={{ flex: 1, minWidth: "300px" }}>
              <PortfolioSummaryCard cash={portfolioCash} reservedCash={reservedCash} stocks={portfolioStocks} />
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div style={{ marginTop: "2rem" }}>
          {isOwnProfile || isFriend ? (
            <>
              <Typography variant="h6">Posts</Typography>
              {posts.length === 0 ? (
                <Typography>No posts to show.</Typography>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    username={post.user.username}
                    action={post.transaction.action}
                    price={post.transaction.price}
                    quantity={post.transaction.quantity}
                    symbol={post.transaction.stock_symbol}
                    timestamp={post.timestamp}
                    isWatchlisted={false}
                    onToggleWatchlist={() => {}}
                    isLiked={post.isLiked}
                    comments_count={post.comments_count}
                    comments={post.comments}
                    likes_count={post.likes_count}
                    toggleLike={() => toggleLike(post.id)}
                    handleCommentSubmit={fetchPosts}
                  />
                ))
              )}
            </>
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
              Only friends can view posts.
            </Typography>
          )}
        </div>
      </Container>
    </>
  );
}

export default ProfilePage;
