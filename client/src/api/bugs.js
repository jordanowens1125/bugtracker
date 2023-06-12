import axios from "axios";
const baseURL = process.env.REACT_APP_BASELINE_URL + "bugs";

export const fetchBugs = async (loggedInUser) =>
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

export const fetchBugsByUser = async (loggedInUser, userid) =>
  await axios
    .get(`${baseURL}/user/${userid}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const createBug = async (loggedInUser, newBug) =>
  await axios
    .post(`${baseURL}/create`, newBug, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const updateBug = async (loggedInUser, currentBug, updatedBug) =>
  await axios
    .put(
      `${baseURL}/${currentBug._id}`,
      { currentBug, updatedBug },
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

export const fetchBug = async (loggedInUser, id) =>
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

export const deleteBug = async (loggedInUser, bugID) =>
  await axios.delete(`${baseURL}/delete/${bugID}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUser.token}`,
    },
  });
