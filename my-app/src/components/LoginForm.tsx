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

  // ✅ Password validation
  const isPasswordValid = (pw: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return regex.test(pw);
  };

  // ✅ Backend username availability check
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const res = await api.post("/api/user/check-username/", { username });
      return !res.data.available; // If not available, it means username exists
    } catch (err) {
      console.error("Username check failed", err);
      return false; // assume unique to avoid blocking
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (method === "register") {
      // ✅ Validate inputs
      if (!username || !password) {
        setError("Username and password cannot be empty.");
        setLoading(false);
        return;
      }

      if (!isPasswordValid(password)) {
        setError(
          "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character."
        );
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

    // ✅ Proceed with login/register
    try {
      const res = await api.post(route, { username, password });

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
      const errorMsg =
        error.response?.data?.error || "An error occurred. Please try again.";
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

      {error && <p className="form-error" style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Please wait..." : name}
      </button>
    </form>
  );
}

export default LoginForm;
