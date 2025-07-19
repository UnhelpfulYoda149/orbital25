import Header from "../components/Header";
import { TextField, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../api";
import UserCard from "../components/UserCard";
import FriendRequestCard from "../components/FriendRequestCard";

function FindFriendsPage() {
  const username = localStorage.getItem("username");
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const fetchFriends = async () => {
    try {
      const res = await api.get("/user/friends/", { withCredentials: true });
      setFriends(res.data);
    } catch (err) {
      console.error("Error fetching friend requests", err);
    }
  };

  const fetchRequested = async () => {
    try {
      const res = await api.get("/user/sent-requests/", {
        withCredentials: true,
      });
      setSentRequests(res.data);
    } catch (err) {
      console.error("Error fetching requested users", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get("/user/received-requests/", {
        withCredentials: true,
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching friend requests", err);
    }
  };

  const handleSearch = async () => {
    try {
      setHasSearched(true);
      const res = await api
        .get(`/search-user/?query=${search}`, { withCredentials: true })
        .then((res) =>
          res.data
            .map((item: { username: string }) => item.username)
            .filter((item: string) => !friends.includes(item))
        );
      setResults(res);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleToggle = async (name: string) => {
    try {
      const res = await api.post(
        "/toggle-friend-request/",
        { username: name },
        { withCredentials: true }
      );
      fetchRequested();
    } catch (err) {
      console.error("Unable to send friend request", err);
    }
  };

  const handleAccept = async (name: string) => {
    try {
      const res = await api.post(
        "/accept-friend-request/",
        { username: name },
        { withCredentials: true }
      );
      fetchRequests();
    } catch (err) {
      console.error("Error accepting friend request", err);
    }
  };

  const handleReject = async (name: string) => {
    try {
      const res = await api.post(
        "/reject-friend-request/",
        { username: name },
        { withCredentials: true }
      );
      fetchRequests();
    } catch (err) {
      console.error("Error rejecting friend request", err);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchRequested();
    fetchRequests();
  }, []);

  return (
    <>
      <Header user={username} />
      <div style={{ padding: "1rem", maxWidth: "1000px", margin: "auto" }}>
        <h2>Search</h2>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <TextField
            label="Search for friends!"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
        {hasSearched &&
          (results.length > 0 ? (
            <>
              <h2>Search Results</h2>
              {results.map((username) => (
                <UserCard
                  key={username}
                  username={username}
                  requested={sentRequests.includes(username)}
                  handleClick={() => handleToggle(username)}
                />
              ))}
            </>
          ) : (
            <h3>No results found</h3>
          ))}
        <h2>Friend Requests</h2>
        {requests.length > 0 && (
          <>
            {requests.map((username) => (
              <FriendRequestCard
                key={username}
                username={username}
                handleAccept={() => handleAccept(username)}
                handleReject={() => handleReject(username)}
              />
            ))}
          </>
        )}
        {requests.length == 0 && <h3>No friend requests right now!</h3>}
      </div>
    </>
  );
}

export default FindFriendsPage;
