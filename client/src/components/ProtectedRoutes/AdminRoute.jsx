import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
const Admin = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  return user.role === "Admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/unauthorized" state={{ from: location }} replace />
  );
};

export default Admin;
