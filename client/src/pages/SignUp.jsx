import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import Input from "../components/Shared/GeneralInput";
import Eye from "../assets/Eye";
import EyeHide from "../assets/EyeHide";

const Button = ({ onClick, content, submit, disabled }) => {
  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      className="password-view flex aic jcc"
    >
      {content}
    </button>
  );
};

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();
  const [viewPassword, setViewPassword] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
    } catch (error) {}
  };
  return (
    <div className="flex-column jcc full-height aic page">
      <form className="flex-column aic cover" onSubmit={submit}>
        <h1>Sign Up</h1>
        <label htmlFor="Email:">Email: </label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          label={"Email"}
          type={"email"}
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          label={"Password"}
          type={viewPassword ? "text" : "password"}
          content={
            <Button
              type="button"
              onClick={() => setViewPassword(!viewPassword)}
              content={viewPassword ? <Eye /> : <EyeHide />}
            />
          }
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
