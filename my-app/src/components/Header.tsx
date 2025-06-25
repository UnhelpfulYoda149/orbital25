import { useNavigate } from "react-router-dom";
//import { supabase } from "../App";
import Button from "@mui/material/Button";
import NavBar from "./NavBar";
import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";


interface HeaderProps {
  user: string | null;
}

function Header({ user }: HeaderProps) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  function signOut() {
    // Clear local storage or any authentication token
    localStorage.clear(); // or localStorage.removeItem("ACCESS_TOKEN")
    navigate("/login");
  }

  if (!user) {
    return (
      <header className="App-header">
        <h1>
          Welcome to <strong>TradeConnect</strong>
        </h1>
      </header>
    );
  } else {
    return (
      <header className="App-header">
        <>
          <h5 style={{ position: "absolute", left: 50 }}>
            <strong>TradeConnect</strong>
          </h5>
          <NavBar />
          <div style={{ position: "absolute", right: 50 }}>
            <Grid container direction="row" alignItems="center" spacing={1}>
              {username && (
                <Avatar
                  sx={{ cursor: "pointer", bgcolor: "primary.main" }}
                  onClick={() => navigate(`/profile/${username}`)}
                >
                  {username.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <Button variant="contained" onClick={signOut}>
                Sign Out
              </Button>
            </Grid>
          </div>
        </>
      </header>
    );
  }
}

export default Header;
