export const groupByRoles = (users) => {
  const roles = {};
  const result = [];
  users.map((user) => {
    if (roles[user.role]) {
      roles[user.role] += 1;
      return 1;
    } else {
      roles[user.role] = 1;
      return 1;
    }
  });
  Object.keys(roles).map((role) =>
    result.push({
      id: role,
      label: role,
      value: roles[role],
      role: role,
    })
  );
  return result;
};
