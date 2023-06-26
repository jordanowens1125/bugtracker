export const byDevs = (bugs, setDev) => {
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

export const groupedByProjects = (bugs, setBugsByProject) => {
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

export const byPriority = (bugs, setPriority) => {
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

export const byStatus = (bugs,setStatus) => {
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
