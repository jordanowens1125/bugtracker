export const groupByStatus = (projects) => {
  const statuses = {'Deployed':0, "Production":0};
  const result = [];
  projects.map((project) => {
    if (statuses[project.status]) {
      statuses[project.status] += 1;
      return 1;
    } else {
      statuses[project.status] = 1;
      return 1;
    }
  });
  Object.keys(statuses).map((status) =>
    result.push({
      id: status,
      label: status,
      value: statuses[status],
      status: status,
    })
  );
  return result;
};
