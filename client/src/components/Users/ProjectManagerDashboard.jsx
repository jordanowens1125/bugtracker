import React, { useState, useEffect } from "react";
import api from "../../api/index";
import PieChart from "../Charts/PieChart";
import useAuthContext from "../../hooks/useAuthContext";
import NoData from "../Shared/NoData";
import NoProject from "../Shared/NoProject";
import PMTableContent from "../ProjectManager/PMTableContent";
import Table from "../Shared/Table";
import { byDevs, byPriority, byStatus } from "../ProjectManager/Tickets";
import Error from "../Shared/Error";

const ProjectManagerDashboard = () => {
  const { user } = useAuthContext();
  const [tickets, setTickets] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [project, setProject] = useState();
  const [dev, setDev] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const request = await api.users.fetchPM(user, user._id);
        if (request.project) {
          setProject(request.project);
          if (request.project.tickets) {
            if (request.project.tickets.length > 0) {
              setTickets(request.project.tickets);
              byPriority(request.project.tickets, setPriority);
              byStatus(request.project.tickets, setStatus);
              byDevs(request.project.tickets, setDev);
            }
          }
        }
      } catch (error) {
        setError(
          `Unable to load dashboard because of the following error: ${error.message}`
        );
      }
    };
    fetchTicket();
  }, [user]);
  return (
    <div className="page flex-column text-align">
      <h1>Welcome, {user.name}</h1>
      {error && <Error text={error} />}
      {project && (
        <>
          <i>
            <h2>
              Current Project:
              <a href={`/projects/${project._id}`}>{project.title}</a>
            </h2>
          </i>
          <div className="flex mobile-column full-width aic jcc gap-md">
            <PieChart data={priority} header={"Tickets By Priority"} />

            <PieChart data={status} header={"Tickets By Status"} />

            <PieChart data={dev} header={"Tickets By Dev"} />
          </div>
          {tickets.length > 0 ? (
            <>
              <Table
                headings={[
                  "Title",
                  "Description",
                  "Priority",
                  "Status",
                  "Project",
                  "Assigned To",
                ]}
                content={PMTableContent(tickets, project)}
                caption={"Project Tickets"}
                alignAlways={true}
              />
            </>
          ) : (
            <>
              <NoData />
            </>
          )}
        </>
      )}
      {!project && <NoProject />}
    </div>
  );
};

export default ProjectManagerDashboard;
