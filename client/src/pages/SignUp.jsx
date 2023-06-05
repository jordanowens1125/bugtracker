import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const submit = async (e) => {
    e.preventDefault();
    await signup(email, password);
  };
  return (
    <div className="flex-column jcc full-height aic page">
      <form className="flex-column aic cover" onSubmit={submit}>
        <h1>Sign Up</h1>
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
        {error && <span className="error full-width text-align">{error}</span>}
        <button
          className="button-primary full-width"
          type="submit"
          disabled={isLoading}
        >
          Sign Up
        </button>
        <a href="/demo" className="button-secondary full-width text-align">
          Login as Demo User
        </a>
        <a href="/signin" className="button-ghost full-width text-align">
          Sign In
        </a>
      </form>
    </div>
  );
};

export default SignUp;
