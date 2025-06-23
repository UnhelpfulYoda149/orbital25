import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const pages = [
  { name: "home", url: "/" },
  { name: "dashboard", url: "/dashboard" },
  { name: "portfolio", url: "/portfolio" },
  { name: "transactions", url: "/transactions" },
  { name: "find friends", url: "/find-friends" },
  { name: "friends", url: "/friends" },
];

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPage = location.pathname;

  const onPageSelect = (url: string) => {
    navigate(url);
  };

  return (
    <nav>
      <Box sx={{ flexGrow: 1, display: "flex" }}>
        {pages.map(({ name, url }) => (
          <Button
            key={name}
            onClick={() => onPageSelect(url)}
            sx={{
              my: 2,
              color: selectedPage === url ? "white" : "grey",
              fontWeight: selectedPage === url ? "bold" : "normal",
              "&:hover": {
                opacity: 1,
                color: "primary.main",
              },
              display: "block",
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
