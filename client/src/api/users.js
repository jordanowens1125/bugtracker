import axios from "axios";

const baseURL = process.env.REACT_APP_BASELINE_URL + "users";

export const fetchUsers = async () =>
  await axios.get(baseURL).then((response) => {
    return response.data;
  });

export const findOrCreateUser = async (newUser) =>
  await axios.post(`${baseURL}/findorcreate`, newUser).then((response) => {
    return response.data;
  });

export const updateUser = async (updatedUser) =>
  await axios.put(`${baseURL}/${updatedUser.id}`, updatedUser).then((response) => {
    return response.data;
  });

export const fetchUser = async (id) =>
  await axios.get(`${baseURL}/${id}`).then((response) => {
    return response.data;
  });

export const deleteUser = async (user) =>
  await axios.delete(`${baseURL}/delete/${user._id}`, user).then((response) => {
    return response.data;
  });

export const addUserToProject = async (userID, projectID) =>
  await axios.put(`${baseURL}/project/${userID}`, { projectID: projectID })
    .then((response) => {
      return response.data;
  });

export const unAssignUserFromProject = async (userID, projectID) =>
  await axios.put(`${baseURL}/unassignuserfromproject`, { userID, projectID });

export const assignBugToUser = async (userID, bugID) =>
  await axios.put(`${baseURL}/assignbugtouser/${userID}`, { userID, bugID }).then((response) => {
    return response.data
  });

export const unAssignBugFromUser = async (userID, bugID) =>
  await axios.put(`${baseURL}/unassignbugfromuser/${userID}`, {
    userID,
    bugID,
  }).then((response) => {
    return response.data
  })
;
