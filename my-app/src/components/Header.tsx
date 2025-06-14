import { useNavigate } from "react-router-dom";
//import { supabase } from "../App";
import Button from "@mui/material/Button";

interface HeaderProps {
  user: string | null;
}

function Header({ user }: HeaderProps) { /*
  const navigate = useNavigate();
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    navigate("/login");
    if (error != null) {
      console.error("There is an error when signing out..." + error);
    }
  }

  return (
    <header className="App-header">
      <h1>
        Welcome to <strong>TradeConnect</strong>
        {user}
      </h1>
      {user && (
        <Button variant="contained" onClick={signOut}>
          Sign Out
        </Button>
      )}
    </header>
  );*/
  const navigate = useNavigate();

  function signOut() {
    // Clear local storage or any authentication token
    localStorage.clear(); // or localStorage.removeItem("ACCESS_TOKEN")
    navigate("/login");
  }

  return (
    <header className="App-header">
      <h1>
        Welcome to <strong>TradeConnect</strong>
        {user ? `, ${user}` : ""}
      </h1>
      {user && (
        <Button variant="contained" onClick={signOut}>
          Sign Out
        </Button>
      )}
    </header>
  );
}

export default Header;
