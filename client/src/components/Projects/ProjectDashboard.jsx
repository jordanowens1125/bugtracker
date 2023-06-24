import React, { useEffect, useState } from "react";
import NoData from "../Shared/NoData";
import api from "../../api";
import useAuthContext from "../../hooks/useAuthContext";
import useMessageContext from "../../hooks/messageContext";
import Table from "../Shared/Table";
import EditProjectModal from "./EditProjectModal";

function checkProject(project) {
  if (project.bugs) {
    return true;
  } else {
    return false;
  }
}

const ProjectTableBodyContent = (members, isUserAdmin) => {
  return (
    <>
      {members.map((member) => (
        <tr key={member._id}>
          <td>{member.name}</td>
          <td>{member.email}</td>
          <td>{member.role}</td>
          <td>
            {isUserAdmin && <a href={`/profile/${member._id}`}>Details</a>}
          </td>
        </tr>
      ))}
    </>
  );
};

const ProjectResult = (members, isUserAdmin) => {
  const result = {
    false: <NoData title={"Developers"} caption={"Developers"} />,
    true: (
      <Table
        headings={["Name", "Email", "Role"]}
        content={ProjectTableBodyContent(members, isUserAdmin)}
        caption={"Developers"}
      />
    ),
  };
  return result[members.length > 0];
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
    false: <NoData title={"Bugs"} caption={"Bugs"} />,
    true: (
      <Table
        headings={["Title", "Status", "Priority"]}
        content={BugTableBodyContent(bugs)}
        caption={"Bugs"}
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
              <EditProjectModal
                handleCancel={handleCancel}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                edit={edit}
              />
            </>
          ) : (
            <>
              <div className="flex-column gap-md">
                <h1 className="p-md">{projectDisplay.title}</h1>
                <p className="p-md">{projectDisplay.description}</p>
                {userCanEdit && (
                  <span className="flex">
                    <button
                      className="button-primary"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Project
                    </button>
                    <button
                      className="button-secondary"
                      disabled={createBugMode}
                      onClick={() => setBugMode(true)}
                    >
                      Add New Bug
                    </button>
                    <a
                      href={`/projects/${project._id}/managemembers`}
                      className="button-secondary"
                    >
                      Manage Members
                    </a>
                  </span>
                )}
              </div>
            </>
          )}

          <div className="flex gap-md only-full-width children-equal-flex mobile-column">
            <div className="flex-column gap-lg h-lg mobile-column">
              <div className="overflow-x only-full-width">
                {ProjectResult(project.members, user.role === "Admin")}
              </div>
            </div>
            <div className="flex-column gap-lg h-lg mobile-column">
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
