import React, { useEffect, useState } from "react";
import ProjectsTable from "../components/Projects/ProjectsTable";
import api from "../api/index";
import useAuthContext from "../hooks/useAuthContext";
import Loading from "../components/Shared/Loading";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.projects.fetchProjects(user);
      setProjects(response);
      setLoading(false);
    };
    fetchData();
  }, [user]);
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
