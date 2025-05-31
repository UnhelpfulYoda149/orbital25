import logo from "../logo.svg";
import { supabase } from "../App";
import Button from "@mui/material/Button";

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
      <Button variant="contained" onSubmit={signOut}>
        Sign Out
      </Button>
    </header>
  );
}

export default Header;
