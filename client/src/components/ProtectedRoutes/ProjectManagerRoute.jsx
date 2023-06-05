import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
const ProjectManager = () => {
  const { user } = useAuthContext();
    const location = useLocation();
    const PM = user.role === 'Admin' || user.role === 'Project Manager'
  return PM ? (
    <Outlet />
  ) : (
    <Navigate to="/projectmanager/unauthorized" state={{ from: location }} replace />
  );
};

export default ProjectManager;
