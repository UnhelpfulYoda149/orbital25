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

  const fetchRequested = async () => {
    try {
      const res = await api.get("/user/sent-requests/");
      setSentRequests(res.data);
    } catch (err) {
      console.error("Error fetching requested users", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get("/user/received-requests/");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching friend requests", err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await api
        .get(`/search-user/?query=${search}`)
        .then((res) =>
          res.data.map((item: { username: string }) => item.username)
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
      console.log(res);
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
      console.log(res);
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
      console.log(res);
    } catch (err) {
      console.error("Error rejecting friend request", err);
    }
  };

  useEffect(() => {
    fetchRequested();
    fetchRequests();
  }, []);

  console.log(requests);

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
        {results.length > 0 && (
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
        )}
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
