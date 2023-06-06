import React, { useState, useEffect } from "react";
import api from "../../api/index";
import PieChart from "../Charts/PieChart";
import useAuthContext from "../../hooks/useAuthContext";
import NoData from "../Shared/NoData";
import NoProject from "../Shared/NoProject";

const ProjectManagerDashboard = () => {
  const { user } = useAuthContext();
  const [bugs, setBugs] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [project, setProject] = useState();
  const [dev, setDev] = useState([]);

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

  const byDevs = (bugs) => {
    const devs = {};
    const result = [];
    devs["Unassigned"] = 0;
    bugs.map((bug) => {
      if (bug.assignedTo) {
        if (devs[bug.assignedTo.name]) {
          devs[bug.assignedTo.name] += 1;
          return bug;
        } else {
          devs[bug.assignedTo.name] = 1;
          return 1;
        }
      } else {
        devs["Unassigned"] += 1;
        return 0;
      }
    });
    Object.keys(devs).map((dev) =>
      result.push({
        id: dev,
        label: dev,
        value: devs[dev],
      })
    );
    setDev(result);
  };

  useEffect(() => {
    const fetchBug = async () => {
      const request = await api.users.fetchPM(user, user._id);
      if (request.project) {
        setProject(request.project);
        if (request.project.bugs) {
          if (request.project.bugs.length > 0) {
            setBugs(request.project.bugs);
            byPriority(request.project.bugs);
            byStatus(request.project.bugs);
            byDevs(request.project.bugs);
          }
        }
      }
    };
    fetchBug();
  }, [user]);
  return (
    <div className="page flex-column text-align">
      <h1>Welcome, {user.name}</h1>
      {project && (
        <>
          <div>
            <i>
              <h2>
                Current Project:
                <a href={`/projects/${project._id}`}>{project.title}</a>
              </h2>
            </i>
          </div>
          <h3>Tickets: {bugs.length}</h3>
          <div className="flex mobile-column full-width space-between">
            <PieChart data={priority} header={"Priority"} />

            <PieChart data={status} header={"Status"} />

            <PieChart data={dev} header={"Assigned To"} />
          </div>
          <div className="full-width  aic jcc text-align">
            <p className="caption">Project Tasks</p>
          </div>
          {bugs.length > 0 ? (
            <>
              <div className="overflow-x only-full-width">
                <table className="full-width overflow-x">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Project</th>
                      <th>Assigned To</th>
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
                        <td>
                          {bug.assignedTo ? (
                            <>{bug.assignedTo.name}</>
                          ) : (
                            <>N/A</>
                          )}
                        </td>
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
    </div>
  );
};

export default ProjectManagerDashboard;
