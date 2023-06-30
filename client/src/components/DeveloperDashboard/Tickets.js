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

export const byStatus = (tickets, setStatus) => {
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
