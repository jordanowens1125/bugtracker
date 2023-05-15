import React from "react";
import { useSelector } from "react-redux";

const DeveloperDashboard = () => {
  const currentUser = useSelector((state) => state.currentUser);
  console.log(123);
  return <>Developer Home</>;
};

export default DeveloperDashboard;
