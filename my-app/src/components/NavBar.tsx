import { Button, ThemeProvider } from "@mui/material";
import { NavLink } from "react-router-dom";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { createTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
  },
});

function NavBar() {
  return (
    <nav>
      <ThemeProvider theme={theme}>
        <ToggleButtonGroup exclusive>
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
      </ThemeProvider>

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
