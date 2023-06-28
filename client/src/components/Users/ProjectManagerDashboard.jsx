import React, { useState, useEffect } from "react";
import api from "../../api/index";
import PieChart from "../Charts/PieChart";
import useAuthContext from "../../hooks/useAuthContext";
import NoData from "../Shared/NoData";
import NoProject from "../Shared/NoProject";
import PMTableContent from "../ProjectManager/PMTableContent";
import Table from "../Shared/Table";

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
