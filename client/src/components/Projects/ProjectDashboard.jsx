import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NoData from "../Shared/NoData";
import api from "../../api";
import { setMessage } from "../../redux/actions/messageActions";
import useAuthContext from "../../hooks/useAuthContext";

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
    await api.projects.updateProjectInfo(user, project._id, edit);
    setProjectDisplay(edit);
    setEdit(edit);
    setEditMode(false);
    dispatch(setMessage(`Project ${edit.title} has been successfully edited!`));
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
          <a href="/projects">All Projects</a>
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
              <div className="flex-column gap-md">
                <h1 className="p-md">{projectDisplay.title}</h1>
                <p className="p-md">{projectDisplay.description}</p>
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
              </div>
            </>
          )}

          <div className="flex gap-md only-full-width children-equal-flex mobile-column">
            <div className="flex-column gap-lg h-lg mobile-column">
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
              <div className="overflow-x only-full-width">
                <table className="p-md full-width">
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
                      <NoData />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex-column gap-lg h-lg mobile-column">
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
              <div className="overflow-x only-full-width">
                <table className="p-sm">
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
        <NoData title={"Project"} />
      )}
    </>
  );
};

export default ProjectDashboard;
