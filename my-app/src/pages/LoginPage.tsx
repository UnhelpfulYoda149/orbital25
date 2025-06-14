import LoginForm from "../components/LoginForm";
import { NavLink } from "react-router-dom";
import Header from "../components/Header";

function LoginPage() {
  const username = localStorage.getItem("username");
  
  return (
    <>
      <Header user={username} />
      <LoginForm route="/api/token/" method="login" />
      <p>
        Don't have an account? <NavLink to="/register">Sign up</NavLink> here!
      </p>
    </>
  );
}

export default LoginPage;
