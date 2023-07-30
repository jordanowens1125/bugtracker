export const byDevs = (tickets, setDev) => {
  const devs = {};
  const result = [];
  devs["Unassigned"] = 0;
  tickets.map((ticket) => {
    if (ticket.assignedTo) {
      if (devs[ticket.assignedTo.name]) {
        devs[ticket.assignedTo.name] += 1;
        return ticket;
      } else {
        devs[ticket.assignedTo.name] = 1;
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

export const groupedByProjects = (tickets, setTicketsByProject) => {
  const projects = {};
  const result = [];
  tickets.map((ticket) => {
    if (projects[ticket.projectID.title]) {
      projects[ticket.projectID.title] += 1;
      return ticket;
    } else {
      projects[ticket.projectID.title] = 1;
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
  setTicketsByProject(result);
};

export const byPriority = (tickets, setPriority) => {
  const projects = {};
  const result = [];
  tickets.map((ticket) => {
    if (projects[ticket.priority]) {
      projects[ticket.priority] += 1;
      return ticket;
    } else {
      projects[ticket.priority] = 1;
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

export const byStatus = (tickets,setStatus) => {
  const projects = {};
  const result = [];
  tickets.map((ticket) => {
    if (projects[ticket.status]) {
      projects[ticket.status] += 1;
      return ticket;
    } else {
      projects[ticket.status] = 1;
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
