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
  const [bugs, setBugs] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [project, setProject] = useState();
  const [dev, setDev] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBug = async () => {
      try {
        const request = await api.users.fetchPM(user, user._id);
        if (request.project) {
          setProject(request.project);
          if (request.project.bugs) {
            if (request.project.bugs.length > 0) {
              setBugs(request.project.bugs);
              byPriority(request.project.bugs, setPriority);
              byStatus(request.project.bugs, setStatus);
              byDevs(request.project.bugs, setDev);
            }
          }
        }
      } catch (error) {
        setError(
          `Unable to load dashboard because of the following error: ${error.message}`
        );
      }
    };
    fetchBug();
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
          {bugs.length > 0 ? (
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
                content={PMTableContent(bugs, project)}
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
