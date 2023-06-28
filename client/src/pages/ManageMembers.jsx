import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index";
import useAuthContext from "../hooks/useAuthContext";
import useMessageContext from "../hooks/messageContext";
import NoData from "../components/Shared/NoData";
import Table from "../components/Shared/Table";

const CurrentMembersElement = (users, removeUser) => {
  return (
    <>
      {users.map((user, index) => {
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
  );
};

const AvailableMembersElement = (users, addUser) => {
  return (
    <>
      {users.map((user, index) => {
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
  );
};

const ManageMembers = () => {
  const projectID = useParams().id;
  const [project, setProject] = useState("");
  const [availableMembers, setAvailableMembers] = useState([]);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [savedCurrent, setSavedCurrent] = useState([]);
  const [savedAvailable, setSavedAvailable] = useState([]);
  const [canSave, setCanSave] = useState(false);
  const { user } = useAuthContext();
  const messageInfo = useMessageContext();
  useEffect(() => {
    if (projectID && projectID !== "") {
      const fetchProjectDetails = async () => {
        try {
          const fetchedproject = await api.projects.fetchProject(
            user,
            projectID
          );
          //console.log(fetchedproject);
          setProject(fetchedproject.project);
          const users = fetchedproject.availableMembers.filter(
            (user) => user.role === "Developer"
          );
          setAvailableMembers(users);
          setSavedAvailable(users);
          setCurrentMembers(fetchedproject.project.members);
          setSavedCurrent(fetchedproject.project.members);
        } catch (error) {}
      };
      fetchProjectDetails();
    }
  }, [projectID, user]);

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
      await api.projects.updateMembers(user, projectID, oldIds, newIds);
      setSavedAvailable(availableMembers);
      setSavedCurrent(currentMembers);
      setCanSave(false);
      messageInfo.dispatch({
        type: "SHOW",
        payload: `Project ${project.title} has been successfully updated!`,
      });
    }
  };

  return (
    <>
      <div className="manage-members page">
        <h1>
          This page will be added to project page edit modal as a select list...
        </h1>
        <div className="header flex-column mobile-column">
          <a href={`/projects/${projectID}`} className="p-none">
            To Project Page
          </a>
          <h3> Project: {project.title} </h3>
          <p>Description: {project.description}</p>
        </div>

        <span className="submit flex aic jcc space-between mobile-column">
          <button className="button-secondary" onClick={reset}>
            Reset Filters
          </button>
          <button
            className="button-primary"
            onClick={handleSubmit}
            disabled={!canSave}
          >
            Update Project members
          </button>
        </span>

        <span className="flex gap-md search aic jcc mobile-column">
          <input type="text" placeholder="Search for member" />
          <button className="button-secondary" type="button">
            Clear
          </button>
        </span>

        <div className="selected h-lg">
          {currentMembers && currentMembers.length > 0 ? (
            <>
              <Table
                headings={["Name", "Email", "Role"]}
                caption={"Current Members"}
                content={CurrentMembersElement(currentMembers, removeUser)}
              />
            </>
          ) : (
            <div className="full-width flex-column text-align">
              <p>Current Members</p>
              <NoData title="Users" />
            </div>
          )}
        </div>
        <div className="available h-lg">
          {availableMembers && availableMembers.length > 0 ? (
            <>
              <Table
                headings={["Name", "Email", "Role"]}
                caption={"Available Members"}
                content={AvailableMembersElement(availableMembers, addUser)}
              />
            </>
          ) : (
            <>
              <div className="full-width flex-column text-align">
                <p className="primary">Available Members</p>
                <NoData title="Users" />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageMembers;
