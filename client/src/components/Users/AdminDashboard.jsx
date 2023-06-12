import React, { useEffect, useState } from "react";
import PieChart from "../Charts/PieChart";
import api from "../../api/index";
import useAuthContext from "../../hooks/useAuthContext";
import NoData from "../Shared/NoData";

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const [bugsByProject, setBugsByProject] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [dev, setDev] = useState([]);
  const [bugs, setBugs] = useState([]);

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

  const groupedByProjects = (bugs) => {
    const projects = {};
    const result = [];
    bugs.map((bug) => {
      if (projects[bug.projectID.title]) {
        projects[bug.projectID.title] += 1;
        return bug;
      } else {
        projects[bug.projectID.title] = 1;
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
    setBugsByProject(result);
  };

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

  useEffect(() => {
    const fetchBug = async () => {
      const request = await api.bugs.fetchBugs(user);
      setBugs(request);
      groupedByProjects(request);
      byPriority(request);
      byStatus(request);
      byDevs(request);
    };
    fetchBug();
  }, []);

  return (
    <main className="flex-column aic page">
      <h1>Welcome, {user.name}</h1>
      {bugs.length > 0 ? (
        <>
          <h3>Tickets: {bugs.length}</h3>
          <div className="flex mobile-column full-width space-between aic jcc">
            <PieChart data={bugsByProject} header={"Projects"} />
            <PieChart data={priority} header={"Priority"} />
            <PieChart data={status} header={"Status"} />
            <PieChart data={dev} header={"Assigned To"} />
          </div>
          <div className="full-width  aic jcc text-align">
            <p className="caption">Tasks Activity</p>
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
                    <td>{bug.projectID.title}</td>
                    <td>
                      {bug.assignedTo ? <>{bug.assignedTo.name}</> : <>Unassigned</>}
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
    </main>
  );
};

export default AdminDashboard;
