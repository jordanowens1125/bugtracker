import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
const RequireAuth = () => {
  const { user } = useAuthContext()
  const location = useLocation();
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  ); 
};

export default RequireAuth;
