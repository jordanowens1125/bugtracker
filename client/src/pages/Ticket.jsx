import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index";
import useAuthContext from "../hooks/useAuthContext";
import useMessageContext from "../hooks/messageContext";
import EditBugModal from "../components/Bug/EditBugModal";
import BugInfo from "../components/Bug/BugInfo";

const findUser = (user, users) => {
  for (let i = 0; i < users.length; i++) {
    if (user._id === users[i]._id) {
      return users[i]._id;
    }
  }
  return -1;
};

const Bug = () => {
  const { id } = useParams();
  const [bug, setBug] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [updatedBug, setUpdatedBug] = useState("");
  const [index, setIndex] = useState(-1);
  const { user } = useAuthContext();
  const messageInfo = useMessageContext();
  const canEdit =
    user.role === "Admin" ||
    user.role === "Project Manager" ||
    user.role === "Reviewer";

  useEffect(() => {
    const fetchBug = async () => {
      try {
        const request = await api.tickets.fetchTicket(user, id);
        const bug = request.bug;
        setBug(bug);
        setUpdatedBug(bug);
        //only developers
        setUsers(request.members.filter((user) => user.role === "Developer"));
        if (bug.assignedTo) {
          setIndex(findUser(request.bug.assignedTo, request.members));
        }
      } catch (error) {}
    };
    fetchBug();
  }, [id, user]);

  const handleInputChange = (e) => {
    let value = e.currentTarget.value;
    const copy = { ...updatedBug };
    const name = e.currentTarget.id || e.currentTarget.name;
    if (name === "assignedTo") {
      // value = value;
      setIndex(value);
    }
    copy[name] = value;
    setUpdatedBug(copy);
  };

  const reset = () => {
    setEditMode(false);
    setUpdatedBug(bug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (index < 0) {
      updatedBug.assignedTo = undefined;
    } else {
      updatedBug.assignedTo = index;
    }

    bug.assignedTo = bug?.assignedTo?._id || undefined;
    try {
      await api.tickets.updateTicket(user, bug, updatedBug);
      updatedBug.assignedTo = users.find((user)=> user._id === index);
      setEditMode(false);
      setBug(updatedBug);
      messageInfo.dispatch({
        type: "SHOW",
        payload: `Bug ${bug.title} has been successfully edited!`,
      });
    } catch (error) {}
  };

  return (
    <>
      <div className="page mobile-column aic">
        <div className="bug-page full-width page mobile-column">
          {editMode && (
            <EditBugModal
              updatedBug={updatedBug}
              handleInputChange={handleInputChange}
              reset={reset}
              users={users}
              index={index}
              handleSubmit={handleSubmit}
            />
          )}
          {bug && (
            <BugInfo bug={bug} canEdit={canEdit} setEditMode={setEditMode} />
          )}
          {!bug && <>No Bug</>}
        </div>
      </div>
    </>
  );
};

export default Bug;
