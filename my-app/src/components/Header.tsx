import logo from "../logo.svg";
import { supabase } from "../App";
import Button from "@mui/material/Button";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Routes, Route } from "react-router-dom";

interface HeaderProps {
  user: string | null;
}

function Header({ user }: HeaderProps) {
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error != null) {
      console.error("There is an error when signing out..." + error);
    }
  }

  return (
    <header className="App-header">
      <h1>
        Welcome to <strong>TradeConnect</strong>, {user}
      </h1>
      <Button variant="contained" onClick={signOut}>
        Sign Out
      </Button>
    </header>
  );
}

export default Header;
