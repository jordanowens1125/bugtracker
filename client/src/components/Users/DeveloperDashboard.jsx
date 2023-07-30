import React, { useState, useEffect } from "react";
import PieChart from "../Charts/PieChart";
import api from "../../api/index";
import useAuthContext from "../../hooks/useAuthContext";
import NoData from "../Shared/NoData";
import NoProject from "../Shared/NoProject";
import { byPriority, byStatus } from "../DeveloperDashboard/Tickets";
import Table from "../Shared/Table";
import DevDashboardTable from "../DeveloperDashboard/DevDashboardTable";
import Error from "../Shared/Error";

const DeveloperDashboard = () => {
  const { user } = useAuthContext();
  const [tickets, setTickets] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [project, setProject] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const request = await api.users.fetchUser(user, user._id);
        setProject(request.project);
        setTickets(request.assignedTickets);
        byPriority(request.assignedTickets, setPriority);
        byStatus(request.assignedTickets, setStatus);
      } catch (error) {
        setError(
          `Unable to load dashboard because of the following error: ${error.message}`
        );
      }
    };

    fetchTicket();
  }, [user]);

  return (
    <main className="page flex-column text-align">
      <h1>Welcome, {user.name}</h1>
      {error && <Error text={error} />}
      {project && (
        <>
          <i>
            <h2>
              Assigned Project:
              <a href={`/projects/${project._id}`}>{project.title}</a>
            </h2>
          </i>

          {tickets.length > 0 ? (
            <>
              <div className="flex mobile-column full-width">
                <PieChart data={priority} header={"Priority"} />
                <PieChart data={status} header={"Status"} />
              </div>
              <Table
                headings={[
                  "Title",
                  "Description",
                  "Priority",
                  " Status",
                  "Project",
                  "Deadline",
                ]}
                caption={"Assigned Tickets"}
                content={DevDashboardTable(tickets, project)}
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
    </main>
  );
};

export default DeveloperDashboard;
