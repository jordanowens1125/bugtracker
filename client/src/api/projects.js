import axios from "axios";
const baseURL = process.env.REACT_APP_BASELINE_URL + "projects";

export const fetchProjects = async () =>
  await axios.get(baseURL).then((response) => {
    return response.data;
  });

export const createProject = async (newProject) =>
  await axios.post(`${baseURL}/create`, newProject).then(async (response) => {
    //api call to add project to selected users
    return response.data;
  });

export const updateProjectInfo = async (id, updatedProject) =>
  await axios.put(`${baseURL}/${id}`, updatedProject).then((response) => {
    return response.data;
  });

export const updateMembers = async (id, oldIds, newIds) =>
  await axios.put(`${baseURL}/${id}/updatemembers`, {oldIds,newIds}).then((response) => {
    return response.data;
  });

export const fetchProject = async (id) =>
  await axios.get(`${baseURL}/${id}`).then((response) => {
    return response.data;
  });

export const deleteProject = async (project) =>
  await axios.delete(`${baseURL}/delete/${project._id}`).then((response) => {
    return response.data;
  });
