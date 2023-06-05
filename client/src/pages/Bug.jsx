import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index";
import BugComments from "../components/Bugs/BugComments";
import dayjs from "dayjs";
import { statusList } from "../constants/bug";
import { priorities } from "../constants/bug";
import { useDispatch } from "react-redux";
import { setMessage } from "../redux/actions/messageActions";
import useAuthContext from "../hooks/useAuthContext";

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
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBug = async () => {
      const request = await api.bugs.fetchBug(id);
      const bug = request.bug;
      setBug(bug);
      setUpdattedBug(bug);
      setUsers(request.members);
      if (bug.assignedTo) {
        setIndex(findUser(request.bug.assignedTo, request.members));
      }
    };
    fetchBug();
  }, [id]);

  const handleInputChange = (e) => {
    let value = e.currentTarget.value;
    const copy = { ...updattedBug };
    const name = e.currentTarget.name;
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
    await api.bugs.updateBug(bug, updattedBug);
    updattedBug.assignedTo = users[index];
    setEditMode(false);
    setBug(updattedBug);
    dispatch(setMessage(`Bug ${bug.title} has been successfully edited!`));
  };

  return (
    <>
      <a href={`/projects/${bug.projectID?._id || "-"}`} className="p-none">
        Go to bug project
      </a>
      <div className="bug-page full-width page">
        {bug && (
          <>
            <section className="p-md gap-md flex-column mobile-column jcc">
              {editMode ? (
                <>
                  <form
                    className="flex-column full-width"
                    onSubmit={handleSubmit}
                  >
                    <label htmlFor="title">Title: </label>
                    <input
                      type="text"
                      placeholder="Title..."
                      value={updattedBug.title}
                      onChange={handleInputChange}
                      name="title"
                    />
                    <label htmlFor="title">Assigned To: </label>
                    <select
                      name="assignedTo"
                      value={index}
                      onChange={handleInputChange}
                    >
                      {users.length > 0 ? (
                        <>
                          <option value={-1}>Not Assigned</option>
                          {users.map((user, index) => {
                            return (
                              <option key={user._id} value={index}>
                                {user.name}
                              </option>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <option value="">No users</option>
                        </>
                      )}
                    </select>
                    <label htmlFor="title">Description: </label>
                    <textarea
                      type="text"
                      rows="4"
                      value={updattedBug.description}
                      onChange={handleInputChange}
                      name="description"
                    />
                    <label htmlFor="title">Priority: </label>
                    <select
                      name="priority"
                      value={updattedBug.priority}
                      onChange={handleInputChange}
                    >
                      {priorities.map((priority) => {
                        return (
                          <option value={priority} key={priority}>
                            {priority}
                          </option>
                        );
                      })}
                    </select>
                    <label htmlFor="title">Status: </label>
                    <select
                      name="status"
                      value={updattedBug.status}
                      onChange={handleInputChange}
                    >
                      {statusList.map((status) => {
                        return (
                          <option value={status} key={status}>
                            {status}
                          </option>
                        );
                      })}
                    </select>
                    <label htmlFor="openDate">Start:</label>
                    <input
                      type="date"
                      name="openDate"
                      id="openDate"
                      value={dayjs(updattedBug.openDate).format("YYYY-MM-DD")}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="deadline">Deadline:</label>
                    <input
                      type="date"
                      name="deadline"
                      id="deadline"
                      value={dayjs(updattedBug.deadline).format("YYYY-MM-DD")}
                      onChange={handleInputChange}
                    />
                    <span className="flex gap-md space-between">
                      <button
                        className="button-secondary"
                        type="button"
                        onClick={reset}
                      >
                        Cancel
                      </button>
                      <button className="button-primary" type="submit">
                        Submit
                      </button>
                    </span>
                  </form>
                </>
              ) : (
                <>
                  {/* Only admin and project managers can change these */}
                  <h1>Title: {bug.title}</h1>
                  <p>Description: {bug.description}</p>
                  {/*  */}
                  <p>Project Title: {bug.projectID.title}</p>
                  <p>Assigned To: {bug.assignedTo?.name || "Not Assigned"}</p>
                  <p>Priority: {bug.priority}</p>
                  <p>Status: {bug.status}</p>
                  <p>Start: {dayjs(bug.openDate).format("YYYY-MM-DD")}</p>
                  <p>Deadline: {dayjs(bug.deadline).format("YYYY-MM-DD")}</p>
                  <span>
                    {user.role === "Admin" ||
                      (user.role === "Project Manager" && (
                        <button
                          className="button-secondary"
                          onClick={() => setEditMode(true)}
                        >
                          Edit
                        </button>
                      ))}
                  </span>
                </>
              )}
            </section>
            <div className="h-xl overflow-y comments-section">
              <BugComments bug={bug} />
            </div>
          </>
        )}
        {!bug && <>No bug found</>}
      </div>
    </>
  );
};

export default Bug;
