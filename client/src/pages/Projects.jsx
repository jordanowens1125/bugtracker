import React from "react";
import ProjectsTable from "../components/Projects/ProjectsTable/ProjectsTable";
const Projects = () => {
  return (
    <>
      <div className="flex-column gap-md">
        <h1>Projects</h1>
        <a href="/createproject" aria-label="Open create project form">
          {" "}
          Create Project
        </a>
        <ProjectsTable />
      </div>
    </>
  );
};

export default Projects;
