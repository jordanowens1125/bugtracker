import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUserAuth } from "../context/userAuthContext";
import { selectedUser } from "../redux/actions/userActions";
import api from "../api/index";

function Copyright(props) {
  return <>{`Copyright © ${new Date().getFullYear()}`}</>;
}

const SignIn = () => {
  const { user } = useUserAuth();
  const dispatch = useDispatch();

  const { logIn, googleSignIn } = useUserAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const SignInAsDemoDeveloper = async () => {
    setError("");
    try {
      const demoDeveloperPassword =
        process.env.REACT_APP_DEMO_DEVELOPER_PASSWORD;
      const demoDeveloperEmail = process.env.REACT_APP_DEMO_DEVELOPER_EMAIL;
      const result = await logIn(demoDeveloperEmail, demoDeveloperPassword);
      const currentUser = await api.users.fetchUserByEmail(demoDeveloperEmail);

      dispatch(selectedUser(currentUser));
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  const SignInAsDemoAdmin = async () => {
    setError("");
    try {
      const demoAdminPassword = process.env.REACT_APP_DEMO_ADMIN_PASSWORD;
      const demoAdminEmail = process.env.REACT_APP_DEMO_ADMIN_EMAIL;
      const result = await logIn(demoAdminEmail, demoAdminPassword);
      const currentUser = await api.users.fetchUserByEmail(demoAdminEmail);
      dispatch(selectedUser(currentUser));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  //sign in with google
  const GoogleLogin = async (e) => {
    try {
      const result = await googleSignIn();
      const newUser = {};
      newUser.name = result.user.displayName;
      newUser.uid = result.user.uid;
      newUser.email = result.user.email;
      newUser.photoURL = result.user.photoURL;
      //use api to find or create a user
      //will use result.user displayName, photoURL, email, uid
      const userToBeFoundOrCreated = await api.users.findOrCreateUser(newUser);
      dispatch(selectedUser(userToBeFoundOrCreated));
      navigate(`/`);
    } catch (error) {}
  };
  return (
    <>
      <div className="flex-column jcc full-height aic page">
        <div className="flex-column aic cover">
          <span>Log In</span>
          <button onClick={SignInAsDemoDeveloper} className="button-primary">
            Login as Demo Developer
          </button>
          <button onClick={SignInAsDemoAdmin} className="button-secondary">
            Login as Demo Admin
          </button>
          <span className="flex gap-md aic jcc">
            <button onClick={GoogleLogin} className="button-ghost">Signin with Google</button>
          </span>

          <a href="/signup">Sign Up</a>
        </div>
      </div>
    </>
  );
};

export default SignIn;
