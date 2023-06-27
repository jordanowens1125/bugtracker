import React, { useEffect, useState } from "react";
import PieChart from "../Charts/PieChart";
import api from "../../api/index";
import useAuthContext from "../../hooks/useAuthContext";
import NoData from "../Shared/NoData";
import {
  byDevs,
  groupedByProjects,
  byPriority,
  byStatus,
} from "../AdminDashboard/bugs";
import BarChart from "../Charts/BarChart";
import { groupByRoles } from "../AdminDashboard/user";
import { groupByStatus } from "../AdminDashboard/project";

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const [bugsByProject, setBugsByProject] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [dev, setDev] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchBug = async () => {
      const { bugs, projects, users } = await api.users.fetchAdmin(user);
      setBugs(bugs);
      groupedByProjects(bugs, setBugsByProject);
      byPriority(bugs, setPriority);
      byStatus(bugs, setStatus);
      byDevs(bugs, setDev);
      setUsers(
        users.filter((user) => user.role !== "Admin" && user.role !== "Deleted")
      );
      setProjects(projects);
    };
    fetchBug();
  }, [user]);

  return (
    <main className="flex-column aic page">
      <h1>Welcome, {user.name}</h1>
      {bugs.length > 0 ? (
        <>
          <div className="full-width flex mobile-column-reverse">
            <div className="chart bg-6">Total Projects: {projects.length}</div>
            <div className="chart bg-5">Total Tickets: {bugs.length}</div>
            <div className="chart bg-4">Total Users: {users.length}</div>
          </div>
          <div className="flex full-width ">
            <div className="chart">
              <BarChart
                data={groupByRoles(users)}
                column="role"
                title={"Users By Roles"}
              />
            </div>
            <div className="chart">
              <BarChart
                data={groupByStatus(projects)}
                column="status"
                title={"Projects By Status"}
              />
            </div>
          </div>
          <div className="flex full-width">
            <PieChart data={bugsByProject} header={"By Projects"} />
            <PieChart data={priority} header={"By Priority"} />
            <PieChart data={status} header={"By Status"} />
            <PieChart data={dev} header={"Assigned To"} />
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
