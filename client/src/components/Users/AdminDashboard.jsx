import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CreateProjectModal from "../Projects/CreateProjectModal/CreateProjectModal";


const AdminDashboard = () => {
  const projects = useSelector((state) => state.allProjects.projects);

  return (
    <>
      <CreateProjectModal />
      Admin Home
    </>
  );
};

export default AdminDashboard;
