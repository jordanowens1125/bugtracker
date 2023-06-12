import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index";
import { useDispatch } from "react-redux";
import { setMessage } from "../redux/actions/messageActions";

const ManageMembers = () => {
  const projectID = useParams().id;
  const [project, setProject] = useState("");
  const [availableMembers, setAvailableMembers] = useState([]);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [savedCurrent, setSavedCurrent] = useState([]);
  const [savedAvailable, setSavedAvailable] = useState([]);
  const [canSave, setCanSave] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    if (projectID && projectID !== "") {
      const fetchProjectDetails = async () => {
        const fetchedproject = await api.projects.fetchProject(projectID);
        //console.log(fetchedproject);
        setProject(fetchedproject.project);
        const users = fetchedproject.availableMembers.filter(
          (user) => user.role !== "Deleted" && user.role !== "Admin" && user !== 'Viewer'
        );
        setAvailableMembers(users);
        setSavedAvailable(users);
        setCurrentMembers(fetchedproject.project.members);
        setSavedCurrent(fetchedproject.project.members);
      };
      fetchProjectDetails();
    }
  }, [projectID]);

  const removeUser = (user, index) => {
    const copyCurrent = [...currentMembers];
    const copyAvailable = [...availableMembers];
    copyCurrent.splice(index, 1);
    setCurrentMembers(copyCurrent);
    copyAvailable.push(user);
    setAvailableMembers(copyAvailable);
    setCanSave(true);
  };

  const addUser = (user, index) => {
    const copyCurrent = [...currentMembers];
    const copyAvailable = [...availableMembers];
    copyAvailable.splice(index, 1);
    copyCurrent.push(user);
    setCurrentMembers(copyCurrent);
    setAvailableMembers(copyAvailable);
    setCanSave(true);
  };

  const reset = () => {
    setAvailableMembers(savedAvailable);
    setCurrentMembers(savedCurrent);
    setCanSave(false);
  };

  const handleSubmit = async () => {
    if (canSave) {
      const oldIds = savedCurrent.map((item) => item._id);
      const newIds = currentMembers.map((item) => item._id);
      await api.projects.updateMembers(projectID, oldIds, newIds);
      setSavedAvailable(availableMembers);
      setSavedCurrent(currentMembers);
      setCanSave(false);
      dispatch(
        setMessage(
          `Project ${project.title} has been successfully updated!`
        )
      );
    }
  };

  return (
    <>
      <div className="manage-members page">
        <div className="header flex-column mobile-column">
          <a href={`/projects/${projectID}`} className="p-none">To Project Page</a>
          <h3> Project: {project.title} </h3>
          <p>Description: {project.description}</p>
        </div>

        <span className="submit flex aic jcc space-between">
          <button className="button-secondary" onClick={reset}>
            Reset
          </button>
          <button
            className="button-primary"
            onClick={handleSubmit}
            disabled={!canSave}
          >
            Update Project members
          </button>
        </span>

        <span className="flex gap-md search aic jcc">
          <input type="text" placeholder="Search for member" />
          <button className="button-secondary" type="button">
            Clear
          </button>
        </span>

        <div className="selected h-lg">
          <table className="full-width">
            <caption>Current Members</caption>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {currentMembers && (
                <>
                  {currentMembers.length > 0 ? (
                    <>
                      {currentMembers.map((user, index) => {
                        return (
                          <tr key={user._id}>
                            <td>
                              <button
                                className="button-secondary w-md"
                                onClick={() => removeUser(user, index)}
                              >
                                Remove
                              </button>
                            </td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <tr>
                        <td>No users</td>
                      </tr>
                    </>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="available h-lg">
          <table className="full-width">
            <caption>Available Members</caption>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {availableMembers && (
                <>
                  {availableMembers.length > 0 ? (
                    <>
                      {availableMembers.map((user, index) => {
                        return (
                          <tr key={user._id}>
                            <td>
                              <button
                                className="button-secondary w-md"
                                onClick={() => addUser(user, index)}
                              >
                                Add User
                              </button>
                            </td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <tr>
                        <td>No users</td>
                      </tr>
                    </>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageMembers;
