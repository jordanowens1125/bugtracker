import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  selectedProject,
  removeSelectedProject,
  removeAvailableMembers,
  setAvailableMembers,
} from "../redux/actions/projectActions";
import { removeSelectedBug } from "../redux/actions/bugActions";
import ProjectDashboard from "../components/Projects/ProjectDashboard/ProjectDashboard";
import EditProjectModal from "../components/Projects/EditProjectModal/EditProjectModal";
import api from "../api/index";

const Project = () => {
  const projectID = useParams().id;
  const dispatch = useDispatch();

  useEffect(() => {
    if (projectID && projectID !== "") {
      const fetchProjectDetails = async () => {
        const fetchedproject = await api.projects.fetchProject(projectID);
        //return 1 project
        dispatch(setAvailableMembers(fetchedproject.availableMembers));
        dispatch(selectedProject(fetchedproject.project));
      };
      fetchProjectDetails();
      return () => {
        dispatch(removeSelectedProject());
        dispatch(removeAvailableMembers());
        dispatch(removeSelectedBug());
      };
    }
  }, [projectID, dispatch]);
  return (
    <>
      <EditProjectModal />
      <ProjectDashboard />
    </>
  );
};

export default Project;
