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
    <>
      {isUserAnAdmin && (
        <>
          <AdminDashboard />
        </>
      )}
      {isUserADeveloper && (
        <>
          <DeveloperDashboard />
        </>
      )}
      {isUserAViewer && (
        <>
          <ViewerDashboard />
        </>
      )}
      {isPM && <></>}
    </>
  );
};

export default UserDashboard;
