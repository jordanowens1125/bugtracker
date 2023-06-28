import React, { useState, useEffect } from "react";
import PieChart from "../Charts/PieChart";
import api from "../../api/index";
import dayjs from "dayjs";
import useAuthContext from "../../hooks/useAuthContext";
import NoData from "../Shared/NoData";
import NoProject from "../Shared/NoProject";

const DeveloperDashboard = () => {
  const { user } = useAuthContext();
  const [bugs, setBugs] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [project, setProject] = useState();
  // const [type, setType] = useState([]);
  useEffect(() => {
    const fetchBug = async () => {
      const request = await api.users.fetchUser(user, user._id);
      setProject(request.project);
      setBugs(request.assignedBugs);
      byPriority(request.assignedBugs);
      byStatus(request.assignedBugs);
    };
    fetchBug();
  }, [user]);

  const byPriority = (bugs) => {
    const projects = {};
    const result = [];
    bugs.map((bug) => {
      if (projects[bug.priority]) {
        projects[bug.priority] += 1;
        return bug;
      } else {
        projects[bug.priority] = 1;
        return 1;
      }
    });
    Object.keys(projects).map((project) =>
      result.push({
        id: project,
        label: project,
        value: projects[project],
      })
    );
    setPriority(result);
  };

  const byStatus = (bugs) => {
    const projects = {};
    const result = [];
    bugs.map((bug) => {
      if (projects[bug.status]) {
        projects[bug.status] += 1;
        return bug;
      } else {
        projects[bug.status] = 1;
        return 1;
      }
    });
    Object.keys(projects).map((project) =>
      result.push({
        id: project,
        label: project,
        value: projects[project],
      })
    );
    setStatus(result);
  };

  return (
    <main className="page flex-column text-align">
      <h1>Welcome, {user.name}</h1>
      {project && (
        <>
          <i>
            <h2>
              Assigned Project:
              <a href={`/projects/${project._id}`}>{project.title}</a>
            </h2>
          </i>

          {bugs.length > 0 ? (
            <>
              <div className="flex mobile-column full-width aic jcc">
                <PieChart data={priority} header={"Priority"} />
                <PieChart data={status} header={"Status"} />
              </div>
              <div className="full-width  aic jcc text-align">
                <p className="caption">Assigned Tickets</p>
              </div>
              <div className="overflow-x only-full-width">
                <table className="p-sm">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Project</th>
                      <th>Deadline</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bugs.map((bug) => (
                      <tr key={bug._id}>
                        <td>{bug.title}</td>
                        <td>{bug.description}</td>
                        <td>{bug.priority}</td>
                        <td>{bug.status}</td>
                        <td>{project.title}</td>
                        <td>{dayjs(bug.closeDate).format("MM-DD-YY")}</td>
                        <td className="flex-column gap-md">
                          <a href={`/bugs/${bug._id}`}> See Details</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
