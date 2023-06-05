import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
const ProtectedRoute = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  return !user ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
