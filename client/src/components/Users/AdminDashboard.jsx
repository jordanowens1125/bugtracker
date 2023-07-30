import React, { useEffect, useState } from "react";
import PieChart from "../Charts/PieChart";
import api from "../../api/index";
import useAuthContext from "../../hooks/useAuthContext";
import {
  byDevs,
  groupedByProjects,
  byPriority,
  byStatus,
} from "../AdminDashboard/tickets";
import BarChart from "../Charts/BarChart";
import { groupByRoles } from "../AdminDashboard/user";
import { groupByStatus } from "../AdminDashboard/project";

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const [ticketsByProject, setTicketsByProject] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [dev, setDev] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { tickets, projects, users } = await api.users.fetchAdmin(user);
        setTickets(tickets);
        groupedByProjects(tickets, setTicketsByProject);
        byPriority(tickets, setPriority);
        byStatus(tickets, setStatus);
        byDevs(tickets, setDev);
        setUsers(
          users.filter(
            (user) => user.role !== "Admin" && user.role !== "Deleted"
          )
        );
        setProjects(projects);
      } catch (error) {}
    };
    fetchTicket();
  }, [user]);

  return (
    <main className="flex-column aic page full-height space-between">
      <h1>Welcome, {user.name}</h1>
      <>
        <div className="full-width flex mobile-column-reverse">
          <div className="chart bg-6">Total Projects: {projects.length}</div>
          <div className="chart bg-5">Total Tickets: {tickets.length}</div>
          <div className="chart bg-4">Total Users: {users.length}</div>
        </div>
        <div className="flex full-width ">
          <BarChart
            data={groupByRoles(users)}
            column="role"
            title={"Users By Roles"}
          />

          <BarChart
            data={groupByStatus(projects)}
            column="status"
            title={"Projects By Status"}
          />
        </div>
        <div className="flex full-width">
          <PieChart data={ticketsByProject} header={"By Projects"} />
          <PieChart data={priority} header={"By Priority"} />
          <PieChart data={status} header={"By Status"} />
          <PieChart data={dev} header={"Assigned To"} />
        </div>
      </>
    </main>
  );
};

export default AdminDashboard;
