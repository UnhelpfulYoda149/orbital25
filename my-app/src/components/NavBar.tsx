import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

const pages = [
  { name: "home", url: "/" },
  { name: "dashboard", url: "/dashboard" },
  { name: "portfolio", url: "/portfolio" },
  { name: "transactions", url: "/transactions" },
  { name: "pending orders", url: "/pending-orders" },
  { name: "find friends", url: "/find-friends" },
  { name: "friends", url: "/friends" },
];

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const me = localStorage.getItem("username");

  return (
    <nav style={{ display: "flex", alignItems: "center", padding: "0 1rem" }}>
      <Box sx={{ flexGrow: 1, display: "flex" }}>
        {pages.map(({ name, url }) => (
          <Button
            key={name}
            onClick={() => navigate(url)}
            sx={{
              my: 2,
              color: location.pathname === url ? "white" : "grey",
              fontWeight: location.pathname === url ? "bold" : "normal",
            }}
          >
            {name}
          </Button>
        ))}
      </Box>
    </nav>
  );
}

export default NavBar;
