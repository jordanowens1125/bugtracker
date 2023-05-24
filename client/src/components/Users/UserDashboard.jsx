import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import DeveloperDashboard from "./DeveloperDashboard";
import AdminDashboard from "./AdminDashboard";
import ViewerDashboard from "./ViewerDashboard";

const UserDashboard = () => {
  const user = useSelector((state) => state.currentUser);
  const isUserAnAdmin = user.role === "Admin";
  const isUserADeveloper = user.role === "Developer";
  const isUserAViewer = user.role === "Viewer";
  const isPM = user.role === "Project Manager";
  useEffect(() => {}, [user]);
  return (
    <div className="page mobile-column flex-column aic p-md">
      <h1>Welcome, {user.name}</h1>
      {isUserAnAdmin && (
        <>
          <AdminDashboard />
        </>
      )}
      {isUserADeveloper && (
        <>
          <DeveloperDashboard user={user} />
        </>
      )}
      {isUserAViewer && (
        <>
          <ViewerDashboard />
        </>
      )}
      {isPM && <></>}
    </div>
  );
};

export default UserDashboard;
