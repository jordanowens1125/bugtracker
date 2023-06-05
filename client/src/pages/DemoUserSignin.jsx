import React from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const DemoUserSignin = () => {
  const { signIn, error, isLoading } = useLogin();
  const navigate = useNavigate();
  const SignInAsDemoDeveloper = async () => {
    await signIn(
      process.env.REACT_APP_DEMO_DEVELOPER_EMAIL,
      process.env.REACT_APP_DEMO_DEVELOPER_PASSWORD
    );
    navigate('/')
  };

  const SignInAsDemoAdmin = async () => {
    await signIn(
      process.env.REACT_APP_DEMO_ADMIN_EMAIL,
      process.env.REACT_APP_DEMO_ADMIN_PASSWORD
    );
    navigate("/");
  };

  return (
    <div>
      <h1>Login as Demo User</h1>
      <button onClick={SignInAsDemoDeveloper}>Demo developer</button>
      <button onClick={SignInAsDemoAdmin}>Demo Admin</button>
      <button>Project Manager</button>
      <button>Reviewer</button>
    </div>
  );
};

export default DemoUserSignin;
