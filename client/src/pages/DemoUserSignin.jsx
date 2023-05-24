import React, { useState } from "react";
import api from "../api/index";
import { useDispatch } from "react-redux";
import { useUserAuth } from "../context/userAuthContext";
import { selectedUser } from "../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
const DemoUserSignin = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const { logIn } = useUserAuth();
  const navigate = useNavigate();
  const SignInAsDemoDeveloper = async () => {
    setError("");
    try {
      const demoDeveloperPassword =
        process.env.REACT_APP_DEMO_DEVELOPER_PASSWORD;
      const demoDeveloperEmail = process.env.REACT_APP_DEMO_DEVELOPER_EMAIL;
      await logIn(demoDeveloperEmail, demoDeveloperPassword);
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
      await logIn(demoAdminEmail, demoAdminPassword);
      const currentUser = await api.users.fetchUserByEmail(demoAdminEmail);
      dispatch(selectedUser(currentUser));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
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
