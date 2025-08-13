import Header from "../components/Header";
import { useEffect, useState } from "react";
import api from "../api";
import FriendCard from "../components/FriendCard";

function FriendsPage() {
  const username = localStorage.getItem("username");
  const [friends, setFriends] = useState<string[]>([]);

  const fetchFriends = async () => {
    try {
      const res = await api.get("/user/friends/", { withCredentials: true });
      setFriends(res.data);
    } catch (err) {
      console.error("Error fetching friend requests", err);
    }
  };

  const handleRemove = async (name: string) => {
    try {
      const res = await api.post(
        "/remove-friend/",
        { username: name },
        { withCredentials: true }
      );
      fetchFriends();
    } catch (err) {
      console.error("Error removing friend", err);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <>
      <Header user={username} />
      <div style={{ padding: "1rem", maxWidth: "1000px", margin: "auto" }}>
        <h2>Friends</h2>
        {friends.length > 0 && (
          <>
            {friends.map((username) => (
              <FriendCard
                key={username}
                username={username}
                handleClick={() => handleRemove(username)}
              />
            ))}
          </>
        )}
        {friends.length == 0 && (
          <h3>Head over to Find Friends page to find your friends!</h3>
        )}
      </div>
    </>
  );
}

export default FriendsPage;
