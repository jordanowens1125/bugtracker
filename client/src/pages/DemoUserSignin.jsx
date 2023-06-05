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
    navigate("/");
  };

  const SignInAsDemoAdmin = async () => {
    await signIn(
      process.env.REACT_APP_DEMO_ADMIN_EMAIL,
      process.env.REACT_APP_DEMO_ADMIN_PASSWORD
    );
    navigate("/");
  };

  const SignInAsDemoPM = async () => {
    await signIn(
      process.env.REACT_APP_DEMO_PM_EMAIL,
      process.env.REACT_APP_DEMO_PM_PASSWORD
    );
    navigate("/");
  };

  // const SignInAsDemoReviewer = async () => {
  //   await signIn(
  //     process.env.REACT_APP_DEMO_REVIEWER_EMAIL,
  //     process.env.REACT_APP_DEMO_REVIEWER_PASSWORD
  //   );
  //   //navigate("/");
  // };

  return (
    <div className="border text-align flex-column aic">
      <h1>Login as Demo User</h1>
      {error && <span className="error full-width text-align">{error}</span>}
      <div className="max-w-lg">
        <button onClick={SignInAsDemoDeveloper} disabled={isLoading}>
          Demo developer
        </button>
        <button onClick={SignInAsDemoAdmin} disabled={isLoading}>
          Demo Admin
        </button>
        <button onClick={SignInAsDemoPM} disabled={isLoading}>
          Project Manager
        </button>
        {/* <button onClick={SignInAsDemoReviewer} disabled={isLoading}>
          Reviewer
        </button> */}
      </div>
    </div>
  );
};

export default DemoUserSignin;
