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
      return i;
    }
  }
  return -1;
};

const Bug = () => {
  const { id } = useParams();
  const [bug, setBug] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [updattedBug, setUpdattedBug] = useState("");
  const [index, setIndex] = useState(-1);
  const { user } = useAuthContext();
  const messageInfo = useMessageContext();
  const canEdit =
    user.role === "Admin" ||
    user.role === "Project Manager" ||
    user.role === "Reviewer";

  useEffect(() => {
    const fetchBug = async () => {
      const request = await api.bugs.fetchBug(user, id);
      const bug = request.bug;
      setBug(bug);
      setUpdattedBug(bug);
      //only developers
      setUsers(request.members.filter((user) => user.role === "Developer"));
      if (bug.assignedTo) {
        setIndex(findUser(request.bug.assignedTo, request.members));
      }
    };
    fetchBug();
  }, [id, user]);

  const handleInputChange = (e) => {
    let value = e.currentTarget.value;
    const copy = { ...updattedBug };
    const name = e.currentTarget.id || e.currentTarget.name;
    if (name === "assignedTo") {
      value = +value;
      setIndex(value);
    }
    copy[name] = value;
    setUpdattedBug(copy);
  };

  const reset = () => {
    setEditMode(false);
    setUpdattedBug(bug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (index < 0) {
      updattedBug.assignedTo = undefined;
    } else {
      updattedBug.assignedTo = users[index]._id;
    }

    bug.assignedTo = bug?.assignedTo?._id || undefined;
    await api.bugs.updateBug(user, bug, updattedBug);
    updattedBug.assignedTo = users[index];
    setEditMode(false);
    setBug(updattedBug);
    messageInfo.dispatch({
      type: "SHOW",
      payload: `Bug ${bug.title} has been successfully edited!`,
    });
  };

  return (
    <>
      <div className="page mobile-column aic">
        <div className="bug-page full-width page mobile-column">
          {editMode && (
            <EditBugModal
              updattedBug={updattedBug}
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
          {!bug && <>No bug found</>}
        </div>
      </div>
    </>
  );
};

export default Bug;
