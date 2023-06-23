import React, { useEffect, useState } from "react";
import NoData from "../Shared/NoData";
import api from "../../api";
import useAuthContext from "../../hooks/useAuthContext";
import useMessageContext from "../../hooks/messageContext";
import Table from "../Shared/Table";

function checkProject(project) {
  if (project.bugs) {
    return true;
  } else {
    return false;
  }
}

const ProjectTableBodyContent = (members) => {
  return (
    <>
      {members.map((member) => (
        <tr key={member._id}>
          <td>{member.name}</td>
          <td>{member.email}</td>
          <td>{member.role}</td>
        </tr>
      ))}
    </>
  );
};

const ProjectResult = (members) => {
  const result = {
    false: <NoData title={"Members"} />,
    true: (
      <Table
        headings={["Name", "Email", "Role"]}
        content={ProjectTableBodyContent(members)}
      />
    ),
  };
  return result[members.length>0];
};

const BugTableBodyContent = (bugs) => {
  return (
    <>
      {bugs.map((bug) => (
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
  );
};

const BugResult = (bugs) => {
  const result = {
    false: <NoData title={"Bugs"} />,
    true: (
      <Table
        headings={["Name", "Email", "Role"]}
        content={BugTableBodyContent(bugs)}
      />
    ),
  };
  return result[bugs.length > 0];
};

const ProjectDashboard = ({ project, createBugMode, setBugMode }) => {
  const { user } = useAuthContext();
  const userCanEdit = user.role === "Admin" || user.role === "Project Manager";
  const isCurrentProjectFilled = checkProject(project);
  const [editMode, setEditMode] = useState(false);
  const [edit, setEdit] = useState();
  const [projectDisplay, setProjectDisplay] = useState(project);
  const messageInfo = useMessageContext();
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
    messageInfo.dispatch({
      type: "SHOW",
      payload: `Project ${edit.title} has been successfully edited!`,
    });
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
                {ProjectResult(project.members)}
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
                {BugResult(project.bugs, "Bugs")}
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
