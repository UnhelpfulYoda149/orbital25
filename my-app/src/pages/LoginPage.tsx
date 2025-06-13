import LoginForm from "../components/LoginForm";
import { NavLink } from "react-router-dom";

function LoginPage() {
  return (
    <>
      <LoginForm route="/api/token/" method="login" />
      <p>
        Don't have an account? <NavLink to="/register">Sign up</NavLink> here!
      </p>
    </>
  );
}

export default LoginPage;
