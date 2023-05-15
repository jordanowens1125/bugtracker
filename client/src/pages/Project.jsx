import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectDashboard from "../components/Projects/ProjectDashboard/ProjectDashboard";
import api from "../api/index";

const Project = () => {
  const projectID = useParams().id;
  const [project, setProject] = useState("");
  useEffect(() => {
    if (projectID && projectID !== "") {
      const fetchProjectDetails = async () => {
        const fetchedproject = await api.projects.fetchProject(projectID);
        console.log(fetchedproject);
        //return 1 project
        setProject(fetchedproject.project);
      };
      fetchProjectDetails();
    }
  }, [projectID]);
  return (
    <>
      <ProjectDashboard project={project} />
    </>
  );
};

export default Project;
