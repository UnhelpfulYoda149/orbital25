import LoginForm from "../components/LoginForm"
import { NavLink } from "react-router-dom";
import Header from "../components/Header";
import "../styles/RegisterPage.css";

function RegisterPage() {
  const username = localStorage.getItem("username");

  return (
    <>
      <Header user={username} />
      <div className="register-page">
        <LoginForm route="/api/user/register/" method="register" />
        <div className="login-link">
          <p>
            Already have an account? <NavLink to="/login">Log in</NavLink> here!
          </p>
        </div>
      </div>
    </>
  )
}

export default RegisterPage;
