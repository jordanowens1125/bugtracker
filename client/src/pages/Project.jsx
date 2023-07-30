import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectDashboard from "../components/Project/ProjectDashboard";
import api from "../api/index";
import useAuthContext from "../hooks/useAuthContext";
import useMessageContext from "../hooks/messageContext";
import CreateTicketModal from "../components/Project/CreateTicketModal";
import initialTicketState from "../components/Project/initialTicketState";

const Project = () => {
  const projectID = useParams().id;
  const [project, setProject] = useState("");
  const [available, setAvailable] = useState("");
  const [createTicketMode, setCreateTicketMode] = useState(false);
  const [ticket, setTicket] = useState(initialTicketState);
  const { user } = useAuthContext();
  const messageInfo = useMessageContext();

  const addNewTicket = async (e) => {
    e.preventDefault();
    ticket.projectID = projectID;
    try {
      const newticket = await api.tickets.createTicket(user, ticket);
      const copiedProject = { ...project };
      copiedProject.tickets.push(newticket);
      setProject(copiedProject);
      cancel();
      messageInfo.dispatch({
        type: "SHOW",
        payload: `Ticket ${newticket.title} has been successfully created!`,
      });
    } catch (error) {}
  };

  const cancel = () => {
    setTicket(initialTicketState);
    setCreateTicketMode(false);
  };

  const handleInputChange = (e) => {
    let value = e.currentTarget.value;
    const copy = { ...ticket };
    const name = e.currentTarget.name;
    copy[name] = value;
    setTicket(copy);
  };

  useEffect(() => {
    if (projectID && projectID !== "") {
      const fetchProjectDetails = async () => {
        try {
          const fetchedproject = await api.projects.fetchProject(
            user,
            projectID
          );
          //return 1 project
          setProject(fetchedproject.project);
          setAvailable(fetchedproject.availableMembers);
        } catch (error) {}
      };
      fetchProjectDetails();
    }
  }, [projectID, user]);
  return (
    <>
      <div className="page mobile-column">
        <ProjectDashboard
          project={project}
          createTicketMode={createTicketMode}
          setTicketMode={setCreateTicketMode}
          available={available}
          setProject={setProject}
          setAvailable={setAvailable}
        />
        {createTicketMode && (
          <CreateTicketModal
            project={project}
            ticket={ticket}
            onSubmit={addNewTicket}
            handleInputChange={handleInputChange}
            cancel={cancel}
          />
        )}
      </div>
    </>
  );
};

export default Project;
