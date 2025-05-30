import logo from "../logo.svg";

interface HeaderProps {
  user: string | null;
}

function Header({ user }: HeaderProps) {
  return (
    <header className="App-header">
      <h1>
        Welcome to <strong>TradeConnect</strong>, {user}
        test line
      </h1>
    </header>
  );
}

export default Header;
