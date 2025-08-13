import LoginForm from "../components/LoginForm";
import { NavLink } from "react-router-dom";
import Header from "../components/Header";
import "../styles/LoginPage.css";

function LoginPage() {
  const username = localStorage.getItem("username");

  return (
    <>
      <Header user={username} />
      <div className="login-page">
        <LoginForm route="/api/token/" method="login" />
        <div className="signup-link">
          <p>
            Don't have an account? <NavLink to="/register">Sign up</NavLink>{" "}
            here!
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
