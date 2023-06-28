import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectDashboard from "../components/Project/ProjectDashboard";
import api from "../api/index";
import useAuthContext from "../hooks/useAuthContext";
import useMessageContext from "../hooks/messageContext";
import CreateTicketModal from "../components/Project/CreateTicketModal";
import initialBugState from "../components/Project/initialBugState";

const Project = () => {
  const projectID = useParams().id;
  const [project, setProject] = useState("");
  const [available, setAvailable] = useState("");
  const [createBugMode, setCreateBugMode] = useState(false);
  const [bug, setBug] = useState(initialBugState);
  const { user } = useAuthContext();
  const messageInfo = useMessageContext();
  
  const addNewBug = async (e) => {
    e.preventDefault();
    bug.projectID = projectID;
    try {
      const newBug = await api.bugs.createBug(user, bug);
      const copiedProject = { ...project };
      copiedProject.bugs.push(newBug);
      setProject(copiedProject);
      cancel();
      messageInfo.dispatch({
        type: "SHOW",
        payload: `Bug ${newBug.title} has been successfully created!`,
      });
    } catch (error) {}
  };

  const cancel = () => {
    setBug(initialBugState);
    setCreateBugMode(false);
  };

  const handleInputChange = (e) => {
    let value = e.currentTarget.value;
    const copy = { ...bug };
    const name = e.currentTarget.name;
    copy[name] = value;
    setBug(copy);
  };
  useEffect(() => {
    if (projectID && projectID !== "") {
      const fetchProjectDetails = async () => {
        const fetchedproject = await api.projects.fetchProject(user, projectID);
        //return 1 project
        setProject(fetchedproject.project);
        setAvailable(fetchedproject.availableMembers);
      };
      fetchProjectDetails();
    }
  }, [projectID, user]);
  return (
    <>
      <div className="page mobile-column">
        <ProjectDashboard
          project={project}
          createBugMode={createBugMode}
          setBugMode={setCreateBugMode}
          available={available}
          setProject={setProject}
          setAvailable={setAvailable}
        />
        {createBugMode && (
          <CreateTicketModal
            project={project}
            bug={bug}
            onSubmit={addNewBug}
            handleInputChange={handleInputChange}
            cancel={cancel}
          />
        )}
      </div>
    </>
  );
};

export default Project;
