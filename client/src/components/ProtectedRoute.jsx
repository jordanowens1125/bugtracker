import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/userAuthContext";
import { useDispatch, useSelector } from "react-redux";
import { selectedUser } from "../redux/actions/userActions";
import Loading from "./Loading";
import api from "../api/index";

const ProtectedRoute = ({ user }) => {
  const location = useLocation();
  // const users = useSelector((state) => state.allUsers.users);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const current = await api.users.fetchUserByEmail(user.email);
      dispatch(selectedUser(current))
    };
    if (user) {
      fetchData();
    }
  }, [user, dispatch]);

  if (user === undefined) return <Loading />;

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
