import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import Eye from "../assets/Eye";
import EyeHide from "../assets/EyeHide";
import Input from "../components/Shared/GeneralInput";
import Error from "../components/Shared/Error";

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

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, error, isLoading } = useLogin();
  const [viewPassword, setViewPassword] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (err) {}
  };
  return (
    <>
      <div className="flex-column jcc full-height aic page">
        <form
          className="flex-column aic jcc cover full-width"
          onSubmit={submit}
        >
          <h1>Log In</h1>
          <Input
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            label={"Email"}
            type="email"
          />
          <div className="flex full-width gap-0 jcc">
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
          </div>

          {error && <Error text={error} />}

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
          <p className="secondary">*Please give the app a moment to load up.</p>
        </form>
      </div>
    </>
  );
};

export default SignIn;
