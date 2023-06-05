import React, { useEffect, useState } from "react";
import PieChart from "../Charts/PieChart";
import api from "../../api/index";

const AdminDashboard = () => {
  const [bugsByProject, setBugsByProject] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [dev, setDev] = useState([]);
  const [bugs, setBugs] = useState([]);

  const byDevs = (bugs) => {
    const devs = {};
    const result = [];
    bugs.map((bug) => {
      if (devs[bug.assignedTo]) {
        devs[bug.assignedTo] += 1;
        return bug;
      } else {
        devs[bug.assignedTo] = 1;
        return 1;
      }
    });
    Object.keys(devs).map((dev) =>
      result.push({
        id: dev,
        label: dev,
        value: devs[dev],
      })
    );
    console.log(result);
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
      const request = await api.bugs.fetchBugs();
      setBugs(request);
      groupedByProjects(request);
      byPriority(request);
      byStatus(request);
      byDevs(request);
    };
    fetchBug();
  }, []);

  return (
    <>
      {/* <a href="/createproject" aria-label="Open create project form">
        {" "}
        Create Project
      </a> */}
      <h3>Tickets: {bugs.length}</h3>
      <div className="flex mobile-column full-width space-between">
        <div className="flex-column aic text-align">
          <i className="full-width chart-header">Projects</i>
          <div className="chart">
            <PieChart data={bugsByProject} />
          </div>
        </div>

        <div className="flex-column aic text-align">
          <i className="full-width chart-header">Priority</i>
          <div className="chart">
            <PieChart data={priority} />
          </div>
        </div>

        <div className="flex-column aic text-align">
          <i className="full-width chart-header">Status</i>
          <div className="chart">
            <PieChart data={status} />
          </div>
        </div>

        <div className="flex-column aic text-align">
          <i className="full-width chart-header">Developers</i>
          <div className="chart">
            <PieChart data={dev} />
          </div>
        </div>
      </div>
      <table className="full-width">
        <caption>Tasks Activity</caption>
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
              <td>{bug.assignedTo ? <>{bug.assignedTo.name}</> : <>N/A</>}</td>
              <td className="flex-column gap-md">
                <a href={`/bugs/${bug._id}`}> See Details</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminDashboard;
