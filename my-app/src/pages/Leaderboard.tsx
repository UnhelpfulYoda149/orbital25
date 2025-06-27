import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Box,
} from "@mui/material";
import api from "../api";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";

function LeaderboardPage() {
  const [mode, setMode] = useState("global");
  const [leaders, setLeaders] = useState<any[]>([]);
  const username = localStorage.getItem("username");

  const fetchLeaders = async () => {
    try {
      const res = await api.get(`/leaderboard/${mode}/`, {
        withCredentials: true,
      });
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
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {/* Flush ProfileCard to the left */}
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
                  #{index + 1}
                </Typography>
                <ProfileCard username={user.username} bgcolor="#e3f2fd" />
              </Box>

              {/* Portfolio Value on the right */}
              <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '1.2rem' }}>
                ${user.portfolio_value.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Container>
    </>
  );
}

export default LeaderboardPage;
