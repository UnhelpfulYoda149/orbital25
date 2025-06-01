import { Link } from "react-router-dom";
import { Button } from "@mui/material";

function NavBar() {
  return (
    <>
      <Link to="/dashboard">
        <Button>Dashboard</Button>
      </Link>
      <Link to="/order">
        <Button>Order</Button>
      </Link>
      <Link to="/portfolio">
        <Button>Portfolio</Button>
      </Link>
    </>
  );
}

export default NavBar;
