import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, error, isLoading } = useLogin();
  // const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    await signIn(email, password);
  };
  return (
    <>
      <div className="flex-column jcc full-height aic page">
        <form
          className="flex-column aic jcc cover full-width"
          onSubmit={submit}
        >
          <h1>Log In</h1>
          <label htmlFor="Email:">Email: </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            aria-label="Email"
            className="full-width"
          />
          <label htmlFor="Password:">Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            aria-label="Password"
            className="full-width"
          />
          {error && (
            <span className="error full-width text-align">{error}</span>
          )}

          <button
            className="button-primary full-width"
            type="submit"
            disabled={isLoading}
          >
            Login
          </button>
          <a href="/demo" className="button-secondary full-width text-align">
            Login as Demo User
          </a>
          {/* <a href="/signup" className="button-ghost full-width text-align">
            Sign Up
          </a> */}
        </form>
      </div>
    </>
  );
};

export default SignIn;
