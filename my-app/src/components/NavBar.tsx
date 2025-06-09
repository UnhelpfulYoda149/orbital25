import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

function NavBar() {
  return (
    <nav>
      <ToggleButtonGroup color="info" exclusive>
        <ToggleButton value="home">
          <NavLink
            to="/"
            style={({ isActive }) => ({
              textDecoration: isActive ? "underline" : "none",
              color: isActive ? "blue" : "black",
            })}
          >
            Home
          </NavLink>
        </ToggleButton>

        <ToggleButton value="dashboard">
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              textDecoration: isActive ? "underline" : "none",
              color: isActive ? "blue" : "black",
            })}
          >
            Dashboard
          </NavLink>
        </ToggleButton>
        <ToggleButton value="portfolio">
          <NavLink
            to="/portfolio"
            style={({ isActive }) => ({
              textDecoration: isActive ? "underline" : "none",
              color: isActive ? "blue" : "black",
            })}
          >
            Portfolio
          </NavLink>
        </ToggleButton>
      </ToggleButtonGroup>

      {/* <Button>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            textDecoration: isActive ? "underline" : "none",
            color: isActive ? "blue" : "black",
          })}
        >
          Home
        </NavLink>
      </Button>

      <NavLink
        to="/dashboard"
        style={({ isActive }) => ({
          textDecoration: isActive ? "underline" : "none",
          color: isActive ? "blue" : "black",
        })}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/order"
        style={({ isActive }) => ({
          textDecoration: isActive ? "underline" : "none",
          color: isActive ? "blue" : "black",
        })}
      >
        Order
      </NavLink>
      <NavLink
        to="/portfolio"
        style={({ isActive }) => ({
          textDecoration: isActive ? "underline" : "none",
          color: isActive ? "blue" : "black",
        })}
      >
        Portfolio
      </NavLink> */}
    </nav>
  );
}

export default NavBar;
