import { FormEvent, ChangeEvent, useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check login details
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <h2>login here</h2>
      <div>
        <form onSubmit={onLoginSubmit}>
          <label>Username</label>
          <input
            type="text"
            onChange={onUsernameChange}
            value={username}
          ></input>
          <br />
          <label>Password</label>
          <input
            type="password"
            onChange={onPasswordChange}
            value={password}
          ></input>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
      <br />
      <div>
        <p>
          Don't have an account yet? <i>Register</i> now!
        </p>
      </div>
    </>
  );
}
export default Login;
