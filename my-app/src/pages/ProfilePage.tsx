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

function ProfilePage() {
  const { username } = useParams<{ username: string }>(); // Username from URL
  const currentUser = localStorage.getItem("username");   // Logged-in user
  const isOwnProfile = currentUser === username;

  const [bio, setBio] = useState("");
  const [newBio, setNewBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [friendCount, setFriendCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [isFriend, setIsFriend] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/user/${username}/profile/`, {
          withCredentials: true,
        });
        setBio(res.data.bio || "");
        setFriendCount(res.data.friend_count);
        setPostCount(res.data.post_count);
        setIsFriend(res.data.is_friend);
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

    fetchProfile();
    fetchPosts();
  }, [username]);

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

  return (
    <>
      <Header user={username || ""} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
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
                  <Button
                    onClick={() => setEditingBio(false)}
                    color="secondary"
                    sx={{ ml: 1 }}
                  >
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
            <Typography variant="body2" sx={{ mt: 1 }}>
              {bio || "No bio yet."}
            </Typography>
          )}
        </div>

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
                    username={post.user.username}
                    action={post.transaction.action}
                    price={post.transaction.price}
                    quantity={post.transaction.quantity}
                    symbol={post.transaction.stock_symbol}
                    timestamp={post.timestamp}
                    isWatchlisted={false}
                    onToggleWatchlist={() => {}}
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
