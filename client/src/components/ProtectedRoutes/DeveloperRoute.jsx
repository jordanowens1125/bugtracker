import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
const Developer = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  return user.role === "Developer" ? (
    <Outlet />
  ) : (
    <Navigate to="/developer/unauthorized" state={{ from: location }} replace />
  );
};

export default Developer;
