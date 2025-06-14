import LoginForm from "../components/LoginForm"
import { NavLink } from "react-router-dom";
import Header from "../components/Header";

function RegisterPage() {
  const username = localStorage.getItem("username");

  return (
    <>
      <Header user={username} />
      <LoginForm route="/api/user/register/" method="register" />
      <p>
        Already have an account? <NavLink to="/login">Log in</NavLink> here!
      </p>
    </>
  )
}

export default RegisterPage;
