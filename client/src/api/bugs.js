//const axios = require('axios')
import axios from "axios";
const baseURL = process.env.REACT_APP_BASELINE_URL + "bugs";

export const fetchBugs = async () =>
  await axios.get(baseURL).then((response) => {
    return response.data;
  });

export const createBug = async (newBug) =>
  await axios.post(`${baseURL}/create`, newBug).then((response) => {
    return response.data;
  });

export const updateBug = async (currentBug, updatedBug) =>
  await axios
    .put(`${baseURL}/${currentBug._id}`, { currentBug, updatedBug })
    .then((response) => {
      return response.data;
    });

export const fetchBug = async (id) =>
  await axios.get(`${baseURL}/${id}`).then((response) => {
    return response.data;
  });

export const deleteBug = async (bugID) =>
  await axios.delete(`${baseURL}/delete/${bugID}`);
