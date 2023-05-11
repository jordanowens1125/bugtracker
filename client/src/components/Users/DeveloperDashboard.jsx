import React from "react";
import { useSelector } from "react-redux";

const DeveloperDashboard = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const allBugs = useSelector((state) => state.allBugs.bugs);

  //return only bugs that match the user project id
  //const projectBugs= allBugs.filter(bug=>bug.projectID._id==currentUser.project._id)
  const projects = useSelector((state) => state.allProjects.projects);

  return <>Developer Home</>;
};

export default DeveloperDashboard;
