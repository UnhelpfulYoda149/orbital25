import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const pages = ["home", "dashboard", "portfolio", "transactions", "friends"];

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPage = location.pathname.slice(1);

  const onPageSelect = (page: string) => {
    navigate("/" + page);
  };

  return (
    <nav>
      <Box sx={{ flexGrow: 1, display: "flex" }}>
        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => onPageSelect(page)}
            sx={{
              my: 2,
              color: selectedPage === page ? "white" : "grey",
              fontWeight: selectedPage === page ? "bold" : "normal",
              "&:hover": {
                opacity: 1,
                color: "primary.main",
              },
              display: "block",
            }}
          >
            {page}
          </Button>
        ))}
      </Box>
    </nav>
  );
}

export default NavBar;
