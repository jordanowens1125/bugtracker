import React from "react";
import DeveloperDashboard from "./DeveloperDashboard";
import AdminDashboard from "./AdminDashboard";
import ViewerDashboard from "./ViewerDashboard";

const UserDashboard = ({ user }) => {
  const dashboards = {
    Admin: <AdminDashboard />,
    Developer: <DeveloperDashboard user={user} />,
    Viewer: <ViewerDashboard />,
    //'Project Manager':
  };
  return (
    <div className="page mobile-column flex-column aic p-md">
      <h1>Welcome, {user.email}</h1>
      {dashboards[user.role]}
    </div>
  );
};

export default UserDashboard;
