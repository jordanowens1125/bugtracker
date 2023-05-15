import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index";
import BugComments from "../components/Bugs/BugComments/BugComments";
import dayjs from "dayjs";
import { statusList } from "../constants/bug";
import { priorities } from "../constants/bug";
const Bug = () => {
  const { id } = useParams();
  const [bug, setBug] = useState("");
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    const fetchBug = async () => {
      const request = await api.bugs.fetchBug(id);
      setBug(request);
    };
    fetchBug();
  }, [id]);

  const handleSubmit = () => {};
  return (
    <>
      <a href={`/projects/${bug.projectID?._id || "-"}`} className="p-none">
        Go to bug project
      </a>
      <div className="bug-page">
        {bug && (
          <>
            <section className="p-md gap-md flex-column mobile-column jcc">
              {editMode ? (
                <>
                  <form className="flex-column w-lg" onSubmit={handleSubmit}>
                    <label htmlFor="title">Title: </label>
                    <input type="text" placeholder="Title..." />
                    <label htmlFor="title">Description: </label>
                    <textarea type="text" rows="4" />
                    <label htmlFor="title">Priority: </label>
                    <select name="cars" id="cars">
                      {priorities.map((priority) => {
                        return (
                          <option value={priority} key={priority}>
                            {priority}
                          </option>
                        );
                      })}
                    </select>
                    <label htmlFor="title">Status: </label>
                    <select name="cars" id="cars">
                      {statusList.map((status) => {
                        return (
                          <option value={status} key={status}>
                            {status}
                          </option>
                        );
                      })}
                    </select>
                    <label htmlFor="start">Start:</label>
                    <input
                      type="date"
                      name="start"
                      id="start"
                      // value={formInputData.deadline}
                      // onChange={handleInputChange}
                    />
                    <label htmlFor="deadline">Deadline:</label>
                    <input
                      type="date"
                      name="deadline"
                      id="deadline"
                      // value={formInputData.deadline}
                      // onChange={handleInputChange}
                    />
                    <span className="flex gap-md space-between">
                      <button
                        className="button-secondary"
                        type="button"
                        onClick={() => setEditMode(false)}
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
                  <p>Assigned To: {bug.assignedTo[0]?.name || "-"}</p>
                  <p>Priority: {bug.priority}</p>
                  <p>Status: {bug.status}</p>
                  <p>Start: {dayjs(bug.openDate).format("YYYY-MM-DD")}</p>
                  <p>Deadline: {dayjs(bug.deadline).format("YYYY-MM-DD")}</p>
                  <span>
                    <button
                      className="button-secondary"
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </button>
                  </span>
                </>
              )}
            </section>
            <div className="h-xl overflow-y comments">
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
