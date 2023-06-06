import React, { useEffect, useState } from "react";
import ProjectsTable from "../components/Projects/ProjectsTable";
import api from "../api/index";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.projects.fetchProjects();
      setProjects(response);
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="flex-column gap-md page">
        <h1>Projects</h1>
        {/* <p>{projects.length}</p> */}
        <ProjectsTable projects={projects} />
      </div>
    </>
  );
};

export default Projects;
