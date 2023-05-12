import React from "react";
import { useSelector,} from "react-redux";

const AdminDashboard = () => {
  const projects = useSelector((state) => state.allProjects.projects);

  return (
    <>
      <div className="page border">
        <h1>Welcome username</h1>
        <a href="/createproject" aria-label="Open create project form">
          {" "}
          Create Project
        </a>
        Admin Home

        tickets
        projects
        Schedule
      </div>
    </>
  );
};

export default AdminDashboard;
