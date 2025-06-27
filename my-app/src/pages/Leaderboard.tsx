import { useEffect, useState } from "react";
import { Container, Typography, Button, ToggleButton, ToggleButtonGroup, Paper } from "@mui/material";
import api from "../api";
import Header from "../components/Header";

function LeaderboardPage() {
  const [mode, setMode] = useState("global");
  const [leaders, setLeaders] = useState<any[]>([]);
  const username = localStorage.getItem("username");

  const fetchLeaders = async () => {
    try {
      const res = await api.get(`/leaderboard/${mode}/`, { withCredentials: true });
      setLeaders(res.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, [mode]);

  return (
    <>
    <Header user={username} />
        <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
            {mode === "global" ? "Global Leaderboard" : "Local Leaderboard"}
        </Typography>
        <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, newMode) => newMode && setMode(newMode)}
            sx={{ mb: 3 }}
        >
            <ToggleButton value="global">Global</ToggleButton>
            <ToggleButton value="local">Local</ToggleButton>
        </ToggleButtonGroup>
        {leaders.map((user, index) => (
            <Paper key={user.username} sx={{ p: 2, mb: 1 }}>
            <Typography>
                {index + 1}. @{user.username} — ${user.portfolio_value.toFixed(2)}
            </Typography>
            </Paper>
        ))}
        </Container>
    </>
  );
}

export default LeaderboardPage;
