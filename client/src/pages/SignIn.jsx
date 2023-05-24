import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUserAuth } from "../context/userAuthContext";
import { selectedUser } from "../redux/actions/userActions";
import api from "../api/index";

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


  return (
    <>
      <div className="flex-column jcc full-height aic page">
        <form className="flex-column aic jcc cover">
          <span>Log In</span>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />

          <button className="button-primary">Login</button>
          <a href="/demo" className="button-secondary">
            Login as Demo User
          </a>
          <a href="/signup" className="button-ghost">Sign Up</a>
        </form>
      </div>
    </>
  );
};

export default SignIn;
