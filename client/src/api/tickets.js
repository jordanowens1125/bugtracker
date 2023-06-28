import axios from "axios";
const baseURL = process.env.REACT_APP_BASELINE_URL + "bugs";

export const fetchTickets = async (loggedInUser) =>
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

export const fetchTicketsByUser = async (loggedInUser, userid) =>
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

export const createTicket = async (loggedInUser, newTicket) =>
  await axios
    .post(`${baseURL}/create`, newTicket, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
    .then((response) => {
      return response.data;
    });

export const updateTicket = async (
  loggedInUser,
  currentTicket,
  updatedTicket
) =>
  await axios
    .put(
      `${baseURL}/${currentTicket._id}`,
      { currentTicket, updatedTicket },
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

export const fetchTicket = async (loggedInUser, id) =>
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

export const deleteTicket = async (loggedInUser, ticketID) =>
  await axios.delete(`${baseURL}/delete/${ticketID}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedInUser.token}`,
    },
  });
