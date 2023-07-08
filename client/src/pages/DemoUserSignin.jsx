import React from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";

const DemoUserSignin = () => {
  const { signIn, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const SignInAsDemoDeveloper = async () => {
    try {
      let response = await signIn(
        process.env.REACT_APP_DEMO_DEVELOPER_EMAIL,
        process.env.REACT_APP_DEMO_DEVELOPER_PASSWORD
      );
      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      // console.log(error);
    }
  };

  const SignInAsDemoAdmin = async () => {
    try {
      let response = await signIn(
        process.env.REACT_APP_DEMO_ADMIN_EMAIL,
        process.env.REACT_APP_DEMO_ADMIN_PASSWORD
      );
      if (response.ok) {
        navigate("/");
      }
    } catch (error) {}
  };

  const SignInAsDemoPM = async () => {
    try {
      let response = await signIn(
        process.env.REACT_APP_DEMO_PM_EMAIL,
        process.env.REACT_APP_DEMO_PM_PASSWORD
      );

      if (response.ok) {
        navigate("/");
      }
    } catch (error) {}
  };

  // const SignInAsDemoReviewer = async () => {
  //   await signIn(
  //     process.env.REACT_APP_DEMO_REVIEWER_EMAIL,
  //     process.env.REACT_APP_DEMO_REVIEWER_PASSWORD
  //   );
  //   //navigate("/");
  // };

  return (
    <div className="flex-column aic jcc full-height secondary-bg">
      <div className=" text-align flex-column aic jcc gap-lg cover">
        <Loading isLoading={isLoading} />
        <h1 className="primary ">Login as Demo User</h1>

        <div className="max-w-lg flex mobile-column">
          <button
            className="button-secondary"
            onClick={SignInAsDemoAdmin}
            disabled={isLoading}
          >
            Demo Admin
          </button>
          <button
            className="button-secondary"
            onClick={SignInAsDemoDeveloper}
            disabled={isLoading}
          >
            Demo Developer
          </button>

          <button
            className="button-secondary"
            onClick={SignInAsDemoPM}
            disabled={isLoading}
          >
            Demo Project Manager
          </button>
          {/* <button onClick={SignInAsDemoReviewer} disabled={isLoading}>
          Reviewer
        </button> */}
        </div>
        <Error text={error} />
        <p className="secondary">*Please give the app a moment to load up.</p>
        <a href="/login">Back To Login Page</a>
      </div>
    </div>
  );
};

export default DemoUserSignin;
