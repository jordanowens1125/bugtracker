import axios from "axios";
const baseURL = process.env.REACT_APP_BASELINE_URL + "projects";

export const fetchProjects = async (loggedInUser) =>
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

export const createProject = async (loggedInUser, newProject) =>
  await axios
    .post(`${baseURL}/create`, newProject, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then(async (response) => {
      return response.data;
    });

export const updateProject = async (loggedInUser, id, updatedProject) =>
  await axios
    .put(`${baseURL}/${id}`, updatedProject, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const updateMembers = async (loggedInUser, id, oldIds, newIds) =>
  await axios
    .put(
      `${baseURL}/${id}/updatemembers`,
      { oldIds, newIds },
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

export const fetchProject = async (loggedInUser, id) =>
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

export const deleteProject = async (loggedInUser, project) =>
  await axios
    .delete(`${baseURL}/delete/${project._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });
