import axios from "axios";
const baseURL = process.env.REACT_APP_BASELINE_URL + "comments";

export const fetchBugComments = async (loggedInUser, bugID) =>
  await axios
    .get(`${baseURL}/${bugID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const createComment = async (loggedInUser, newComment) =>
  await axios
    .post(`${baseURL}/create`, newComment, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const deleteComment = async (loggedInUser, comment) =>
  await axios.delete(`${baseURL}/delete/${comment._id}`, comment, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUser.token}`,
    },
  });


