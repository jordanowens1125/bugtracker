import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import api from "../../api";
import { setMessage } from "../../redux/actions/messageActions";
import useAuthContext from "../../hooks/useAuthContext";

const checkIfUserIsAssignedToProject = (user, project) => {
  if (user) {
    if (user.project) {
      if (user.project) {
        if (user.project._id === project._id) {
          return true;
        }
      }
    }
  }
  return false;
};

function checkProject(project) {
  if (project.bugs) {
    return true;
  } else {
    return false;
  }
}

const ProjectDashboard = ({ project, createBugMode, setBugMode }) => {
  const { user } = useAuthContext();
  const userCanEdit = user.role === "Admin" || user.role === "Project Manager";
  const userIsAssignedToProject = checkIfUserIsAssignedToProject(user, project);
  const isCurrentProjectFilled = checkProject(project);
  const [editMode, setEditMode] = useState(false);
  const [edit, setEdit] = useState();
  const [projectDisplay, setProjectDisplay] = useState(project);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const copy = { ...edit };
    copy[e.currentTarget.name] = e.currentTarget.value;
    setEdit(copy);
  };

  const handleCancel = () => {
    setEdit(project);
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.projects.updateProjectInfo(project._id, edit);
    setProjectDisplay(edit);
    setEdit(edit);
    setEditMode(false);
    dispatch(
      setMessage(`Project ${project.title} has been successfully edited!`)
    );
  };

  useEffect(() => {
    setEdit({ title: project.title, description: project.description });
    setProjectDisplay({
      title: project.title,
      description: project.description,
    });
  }, [project]);

  return (
    <>
      {isCurrentProjectFilled ? (
        <>
          <div className=" flex-column p-md gap-lg full-vh full-width">
            <a href="/projects">Back to Projects</a>
            {editMode ? (
              <>
                <form className="flex-column gap-lg" onSubmit={handleSubmit}>
                  <span className="flex-column">
                    <label htmlFor="Title">Title:</label>
                    <input
                      type="text"
                      placeholder="Title..."
                      name="title"
                      value={edit.title}
                      onChange={handleChange}
                      required
                    />
                  </span>
                  <span className="flex-column">
                    <label htmlFor="Description">Description:</label>
                    <textarea
                      name="description"
                      id="description"
                      cols="30"
                      rows="5"
                      placeholder="Description..."
                      value={edit.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </span>
                  <span className="flex gap-md">
                    <button
                      className="button-secondary"
                      onClick={handleCancel}
                      type="button"
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
                <h1>{projectDisplay.title}</h1>
                <p>{projectDisplay.description}</p>
                {userCanEdit && (
                  <span>
                    <button
                      className="button-primary"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Project
                    </button>
                  </span>
                )}
              </>
            )}

            <div className="flex gap-lg full-width full-height children-equal-flex mobile-column">
              <div className="flex-column gap-lg h-lg">
                {userCanEdit ? (
                  <a
                    href={`/projects/${project._id}/managemembers`}
                    className="button"
                  >
                    Manage Members
                  </a>
                ) : (
                  <>
                    <span className="p-md">
                      <b>
                        <i className="secondary">Members</i>
                      </b>
                    </span>
                  </>
                )}

                <table className="p-md full-width h-lg">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.members.length > 0 ? (
                      <>
                        {project.members.map((member) => (
                          <tr key={member._id}>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.role}</td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        <tr>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex-column gap-lg h-lg">
                <span className="flex space-between">
                  {userCanEdit ? (
                    <>
                      <button
                        className="button-secondary"
                        disabled={createBugMode}
                        onClick={() => setBugMode(true)}
                      >
                        Add New Bug
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="p-md">
                        <b>
                          <i className="secondary">Bugs</i>
                        </b>
                      </span>
                    </>
                  )}
                </span>

                <table className="p-md full-width">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.bugs.length > 0 ? (
                      <>
                        {project.bugs.map((bug) => (
                          <tr key={bug._id}>
                            <td>{bug.title}</td>
                            <td>{bug.status}</td>
                            <td>{bug.priority}</td>
                            <td className="flex-column gap-md">
                              <a href={`/bugs/${bug._id}`}>Details</a>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        <tr>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading></Loading>
      )}
    </>
  );
};

export default ProjectDashboard;
