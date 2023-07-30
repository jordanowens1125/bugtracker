import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index";
import useAuthContext from "../hooks/useAuthContext";
import useMessageContext from "../hooks/messageContext";
import EditTicketModal from "../components/Ticket/EditTicketModal";
import TicketInfo from "../components/Ticket/TicketInfo";

const findUser = (user, users) => {
  for (let i = 0; i < users.length; i++) {
    if (user._id === users[i]._id) {
      return users[i]._id;
    }
  }
  return -1;
};

const Ticket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [updatedTicket, setUpdatedTicket] = useState("");
  const [index, setIndex] = useState(-1);
  const { user } = useAuthContext();
  const messageInfo = useMessageContext();
  const canEdit =
    user.role === "Admin" ||
    user.role === "Project Manager" ||
    user.role === "Reviewer";

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const request = await api.tickets.fetchTicket(user, id);
        const ticket = request.ticket;
        setTicket(ticket);
        setUpdatedTicket(ticket);
        //only developers
        setUsers(request.members.filter((user) => user.role === "Developer"));
        if (ticket.assignedTo) {
          setIndex(findUser(request.ticket.assignedTo, request.members));
        }
      } catch (error) {}
    };
    fetchTicket();
  }, [id, user]);

  const handleInputChange = (e) => {
    let value = e.currentTarget.value;
    const copy = { ...updatedTicket };
    const name = e.currentTarget.id || e.currentTarget.name;
    if (name === "assignedTo") {
      // value = value;
      setIndex(value);
    }
    copy[name] = value;
    setUpdatedTicket(copy);
  };

  const reset = () => {
    setEditMode(false);
    setUpdatedTicket(ticket);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (index < 0) {
      updatedTicket.assignedTo = undefined;
    } else {
      updatedTicket.assignedTo = index;
    }

    ticket.assignedTo = ticket?.assignedTo?._id || undefined;
    try {
      await api.tickets.updateTicket(user, ticket, updatedTicket);
      updatedTicket.assignedTo = users.find((user)=> user._id === index);
      setEditMode(false);
      setTicket(updatedTicket);
      messageInfo.dispatch({
        type: "SHOW",
        payload: `Ticket ${ticket.title} has been successfully edited!`,
      });
    } catch (error) {}
  };

  return (
    <>
      <div className="page mobile-column aic">
        <div className="ticket-page full-width page mobile-column">
          {editMode && (
            <EditTicketModal
              updatedTicket={updatedTicket}
              handleInputChange={handleInputChange}
              reset={reset}
              users={users}
              index={index}
              handleSubmit={handleSubmit}
            />
          )}
          {ticket && (
            <TicketInfo ticket={ticket} canEdit={canEdit} setEditMode={setEditMode} />
          )}
          {!ticket && <>No Ticket</>}
        </div>
      </div>
    </>
  );
};

export default Ticket;
