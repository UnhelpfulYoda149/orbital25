import { useState, FormEvent } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/LoginForm.css";

type FormProps = {
  route: string;
  method: "login" | "register";
};

function LoginForm({ route, method }: FormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  // Individual password rules
  const isLongEnough = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const allValid =
    isLongEnough && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const res = await api.post(
        "/user/check-username/",
        { username },
        { withCredentials: true }
      );
      return !res.data.available;
    } catch (err) {
      console.error("Username check failed", err);
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (method === "register") {
      if (!username || !password) {
        setError("Username and password cannot be empty.");
        setLoading(false);
        return;
      }

      if (!allValid) {
        setError("Please meet the password requirements.");
        setLoading(false);
        return;
      }

      const usernameTaken = await checkUsernameExists(username);
      if (usernameTaken) {
        setError("Username is already taken. Please choose another.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await api.post(
        route,
        { username, password },
        { withCredentials: true }
      );

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem("username", username);
        navigate("/");
      } else {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (error: any) {
      let errorMsg = "An error occurred. Please try again.";

      if (error.response) {
        const data = error.response.data;

        if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (Array.isArray(data[firstKey])) {
            errorMsg = `${firstKey}: ${data[firstKey][0]}`;
          }
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>

      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />

      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      {/* Password Checklist */}
      {method === "register" && password && !allValid && (
        <ul className="password-checklist">
          <li className={isLongEnough ? "valid" : "invalid"}>
            {isLongEnough ? "✅" : "❌"} At least 8 characters
          </li>
          <li className={hasUppercase ? "valid" : "invalid"}>
            {hasUppercase ? "✅" : "❌"} At least 1 uppercase letter
          </li>
          <li className={hasLowercase ? "valid" : "invalid"}>
            {hasLowercase ? "✅" : "❌"} At least 1 lowercase letter
          </li>
          <li className={hasDigit ? "valid" : "invalid"}>
            {hasDigit ? "✅" : "❌"} At least 1 digit
          </li>
          <li className={hasSpecialChar ? "valid" : "invalid"}>
            {hasSpecialChar ? "✅" : "❌"} At least 1 special character
          </li>
        </ul>
      )}

      {error && (
        <p className="form-error" style={{ color: "red", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}

      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Please wait..." : name}
      </button>
    </form>
  );
}

export default LoginForm;
