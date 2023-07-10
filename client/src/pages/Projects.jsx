import React, { useEffect, useState } from "react";
import ProjectsTable from "../components/Projects/ProjectsTable";
import api from "../api/index";
import useAuthContext from "../hooks/useAuthContext";
import Error from "../components/Shared/Error";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.projects.fetchProjects(user);
        setProjects(response);
      } catch (error) {
        setError(
          `Unable to get projects because of the following error: ${error.message}`
        );
      }
    };
    fetchData();
  }, [user]);
  return (
    <>
      <div className="flex-column gap-md page">
        <h1>Projects</h1>
        {error && <Error text={error} />}
        <ProjectsTable projects={projects} />
      </div>
    </>
  );
};

export default Projects;
