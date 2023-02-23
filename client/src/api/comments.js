import axios from "axios";
const baseURL = process.env.REACT_APP_BASELINE_URL + "comments";

export const fetchBugComments = async (bugID) =>
  await axios.get(`${baseURL}/${bugID}`).then((response) => {
    return response.data;
  });

export const createComment = async (newComment) =>
  await axios.post(`${baseURL}/create`, newComment).then((response) => {
    return response.data;
  });

export const deleteComment = async (comment) =>
  await axios.delete(`${baseURL}/delete/${comment._id}`, comment);

export const setDeletedUserComments = async (user) =>
  await axios.put(`${baseURL}/setdeletedusercomments`, user);
