import { useNavigate } from "react-router-dom";
//import { supabase } from "../App";
import Button from "@mui/material/Button";
import NavBar from "./NavBar";

interface HeaderProps {
  user: string | null;
}

function Header({ user }: HeaderProps) {
  const navigate = useNavigate();

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
            Welcome to <strong>TradeConnect</strong>, {user}
          </h5>
          <NavBar />
          <div style={{ position: "absolute", right: 50 }}>
            <Button variant="contained" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </>
      </header>
    );
  }
}

export default Header;
