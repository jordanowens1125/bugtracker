import axios from "axios";
const baseURL = process.env.REACT_APP_BASELINE_URL + "users";

export const fetchUsers = async (loggedInUser) =>
  await axios
    .get(baseURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const fetchAvailableUsers = async (loggedInUser) =>
  await axios
    .get(baseURL + "/available", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const updateUser = async (loggedInUser, updatedUser) =>
  await axios
    .put(`${baseURL}/${updatedUser.id}`, updatedUser, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const updateRoles = async (loggedInUser, role, members) =>
  //members is a list of ids from users
  await axios
    .put(
      `${baseURL}/updateroles`,
      { role, members },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    });

export const fetchUser = async (loggedInUser, id) =>
  await axios
    .get(`${baseURL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const fetchPM = async (loggedInUser, id) =>
  await axios
    .get(`${baseURL}/projectmanager/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const fetchAdmin = async (loggedInUser) =>
  await axios
    .get(`${baseURL}/admin`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const fetchUserByEmail = async (loggedInUser, email) =>
  await axios
    .get(`${baseURL}/email/${email}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const deleteUser = async (loggedInUser, user) =>
  await axios
    .delete(`${baseURL}/delete/${user._id}`, user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const deleteUsers = async (loggedInUser, userIDs) =>
  await axios
    .delete(`${baseURL}/delete`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
      data: { userIDs: userIDs },
    })
    .then((response) => {
      return response;
    });

export const addUserToProject = async (loggedInUser, userID, projectID) =>
  await axios
    .put(
      `${baseURL}/project/${userID}`,
      { projectID: projectID },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    });

export const unAssignUserFromProject = async (
  loggedInUser,
  userID,
  projectID
) =>
  await axios.put(
    `${baseURL}/unassignuserfromproject`,
    { userID, projectID },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    }
  );

export const assignBugToUser = async (loggedInUser, userID, bugID) =>
  await axios
    .put(
      `${baseURL}/assignbugtouser/${userID}`,
      { userID, bugID },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    });

export const unAssignBugFromUser = async (loggedInUser, userID, bugID) =>
  await axios
    .put(
      `${baseURL}/unassignbugfromuser/${userID}`,
      {
        userID,
        bugID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    });
