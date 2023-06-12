import React, { useEffect, useState } from "react";
import ProjectsTable from "../components/Projects/ProjectsTable";
import api from "../api/index";
import Loading from "../components/Shared/Loading";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.projects.fetchProjects();
      setProjects(response);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="flex-column gap-md page">
        {loading ? (
          <Loading />
        ) : (
          <>
            <h1>Projects</h1>
            <ProjectsTable projects={projects} />
          </>
        )}
      </div>
    </>
  );
};

export default Projects;
