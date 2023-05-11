import React from "react";
import CreateProjectModal from "../components/Projects/CreateProjectModal/CreateProjectModal";
import ProjectsTable from "../components/Projects/ProjectsTable/ProjectsTable";
const Projects = () => {
  return (
    <>
      <div className="flex-column gap-md">
        <h1>Projects</h1>
        <CreateProjectModal />
        <ProjectsTable />
      </div>
    </>
  );
};

export default Projects;
