import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index";

const ManageMembers = () => {
  const projectID = useParams().id;
  const [project, setProject] = useState("");
  const [availableMembers, setAvailableMembers] = useState([]);
  const [currentMembers, setCurrentMembers] = useState([]);
  useEffect(() => {
    if (projectID && projectID !== "") {
      const fetchProjectDetails = async () => {
        const fetchedproject = await api.projects.fetchProject(projectID);
        //return 1 project
        setProject(fetchedproject.project);
        setAvailableMembers(fetchedproject.availableMembers);
        setCurrentMembers(fetchedproject.project.members);
      };
      fetchProjectDetails();
    }
  }, [projectID]);
  const removeUser = (user, index) => {};
  return (
    <>
      <div className="update-project-members">
        <a href={`/projects/${projectID}`}>To Project Page</a>
        <h3> Manage Project {project.title} Members:</h3>
        <p>Description: {project.description}</p>
        <span className="submit flex aic jcc">
          <button className="button-primary">Update Project members</button>
        </span>

        <table className="full-width current">
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
                    <tr className="flex aic">
                      <td>No users</td>
                    </tr>
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
        <table className="full-width available">
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
                    {availableMembers.map((user) => {
                      return (
                        <tr key={user._id}>
                          <td>
                            <button
                              className="button-secondary w-md"
                              onClick={() => removeUser()}
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
                    <tr className="flex aic">
                      <td>No users</td>
                    </tr>
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageMembers;
