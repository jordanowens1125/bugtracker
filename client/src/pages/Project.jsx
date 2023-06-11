import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectDashboard from "../components/Projects/ProjectDashboard";
import api from "../api/index";
import dayjs from "dayjs";
import { priorities, statusList } from "../constants/bug";
import { useDispatch } from "react-redux";
import { setMessage } from "../redux/actions/messageActions";

const initialBugState = {
  title: "",
  description: "",
  assignedTo: undefined,
  priority: "Low",
  status: "Open",
  openDate: dayjs(new Date()).format("YYYY-MM-DD"),
  deadline: dayjs(new Date()).format("YYYY-MM-DD"),
};

const Project = () => {
  const projectID = useParams().id;
  const [project, setProject] = useState("");
  const [createBugMode, setCreateBugMode] = useState(false);
  const [bug, setBug] = useState(initialBugState);
  const dispatch = useDispatch();

  const addNewBug = async (e) => {
    e.preventDefault();
    bug.projectID = projectID;
    const newBug = await api.bugs.createBug(bug);
    const copiedProject = { ...project };
    copiedProject.bugs.push(newBug);
    console.log(copiedProject);
    setProject(copiedProject);
    cancel();
    dispatch(setMessage(`Bug ${newBug.title} has been successfully created!`));
  };
  const cancel = () => {
    setBug(initialBugState);
    setCreateBugMode(false);
  };

  const handleInputChange = (e) => {
    let value = e.currentTarget.value;
    const copy = { ...bug };
    const name = e.currentTarget.name;
    copy[name] = value;
    setBug(copy);
  };
  useEffect(() => {
    if (projectID && projectID !== "") {
      const fetchProjectDetails = async () => {
        const fetchedproject = await api.projects.fetchProject(projectID);
        //return 1 project
        setProject(fetchedproject.project);
      };
      fetchProjectDetails();
    }
  }, [projectID]);
  return (
    <>
      <div className="page mobile-column">
        <ProjectDashboard
          project={project}
          createBugMode={createBugMode}
          setBugMode={setCreateBugMode}
        />
        {createBugMode && (
          <div className="modal">
            <form className="modal-content" onSubmit={addNewBug}>
              <h2>New Bug</h2>
              <h3>Project: {project.title}</h3>
              <label htmlFor="title">Title: </label>
              <input
                type="text"
                value={bug.title}
                onChange={handleInputChange}
                name="title"
                required
              />
              <label htmlFor="title">Description: </label>
              <textarea
                type="text"
                rows="4"
                value={bug.description}
                onChange={handleInputChange}
                name="description"
                required
              />
              <label htmlFor="title">Assigned To: </label>
              <select
                name="assignedTo"
                value={bug.assignedTo}
                onChange={handleInputChange}
              >
                {project.members.length > 0 ? (
                  <>
                    <option value={undefined}>Not Assigned</option>
                    {project.members.map((user) => {
                      return (
                        <option key={user._id} value={user._id}>
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
              <label htmlFor="title">Priority: </label>
              <select
                name="priority"
                value={bug.priority}
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
                value={bug.status}
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
                value={dayjs(bug.openDate).format("YYYY-MM-DD")}
                onChange={handleInputChange}
              />
              <label htmlFor="deadline">Deadline:</label>
              <input
                type="date"
                name="deadline"
                id="deadline"
                value={dayjs(bug.deadline).format("YYYY-MM-DD")}
                onChange={handleInputChange}
              />
              <span className="flex gap-md">
                <button
                  className="button-secondary"
                  onClick={cancel}
                  type="button"
                >
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  Submit
                </button>
              </span>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Project;
