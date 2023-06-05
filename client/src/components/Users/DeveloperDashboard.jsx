import React, { useState, useEffect } from "react";
import PieChart from "../Charts/PieChart";
import api from "../../api/index";
import dayjs from "dayjs";

const DeveloperDashboard = ({ user }) => {
  const [bugs, setBugs] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  // const [type, setType] = useState([]);
  console.log(bugs);
  useEffect(() => {
    const fetchBug = async () => {
      const request = await api.bugs.fetchBugsByUser(user._id);
      setBugs(request);
      // byType(request);
    };
    console.log(1);
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
    <>
      <a href="/">To Board</a>
      <div className="flex mobile-column full-width aic jcc">
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
      </div>
      {bugs.length > 0 ? (
        <>
          <table className="full-width">
            <caption>Tasks Activity</caption>
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
                  <td>{bug.projectID.title}</td>
                  <td>{dayjs(bug.closeDate).format("MM-DD-YY")}</td>
                  <td className="flex-column gap-md">
                    <a href={`/bugs/${bug._id}`}> See Details</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>No bugs assigned</>
      )}
    </>
  );
};

export default DeveloperDashboard;
