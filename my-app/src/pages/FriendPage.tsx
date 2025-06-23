import Header from "../components/Header";
import { TextField, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../api";
import FriendCard from "../components/FriendCard";

function FriendPage() {
  const username = localStorage.getItem("username");
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequested = async () => {
    try {
      const res = await api.get("/user/sent-requests/");
      setSentRequests(res.data);
    } catch (err) {
      console.error("Error fetching requested users", err);
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

  useEffect(() => {
    fetchRequested();
    setLoading(false);
  }, []);

  console.log(sentRequests);

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
              <FriendCard
                key={username}
                username={username}
                requested={sentRequests.includes(username)}
              />
            ))}
          </>
        )}
        <h2>Friend Requests</h2>
      </div>
    </>
  );
}

export default FriendPage;
