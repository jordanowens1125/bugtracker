import React, { useEffect, useState } from "react";
import NoData from "../Shared/NoData";
import api from "../../api";
import useAuthContext from "../../hooks/useAuthContext";
import useMessageContext from "../../hooks/messageContext";
import EditProjectModal from "./EditProjectModal";
import ProjectTableBodyContent from "./ProjectTableBodyContent";
import BugTableContent from "./BugTableContent";
import EditProjectButtons from "./EditProjectButtons";

function checkProject(project) {
  if (project.bugs) {
    return true;
  } else {
    return false;
  }
}

const ProjectDashboard = ({
  project,
  createBugMode,
  setBugMode,
  available,
}) => {
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
    const bugIds = edit.bugs.map((bug) => bug._id);
    const updatedProject = {
      ...edit,
      bugs: bugIds,
      projectManager: edit.projectManager._id,
    };

    try {
      await api.projects.updateProjectInfo(user, project._id, updatedProject);
      setProjectDisplay(edit);
      setEdit(edit);
      setEditMode(false);
      messageInfo.dispatch({
        type: "SHOW",
        payload: `Project ${edit.title} has been successfully edited!`,
      });
    } catch (error) {}
  };

  useEffect(() => {
    setEdit(project);
    setProjectDisplay(project);
  }, [project]);

  return (
    <>
      {editMode && (
        <>
          <EditProjectModal
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            edit={edit}
            developers={[
              ...project.members.filter((user) => user.role === "Developer"),
              ...available.filter((user) => user.role === "Developer"),
            ]}
            projectManagers={[
              project.projectManager,
              ...available.filter((user) => user.role === "Project Manager"),
            ]}
          />
        </>
      )}
      {isCurrentProjectFilled ? (
        <>
          <div className="flex-column full-width">
            <h1>{projectDisplay.title}</h1>
            <p>Description: {projectDisplay.description}</p>
            {userCanEdit && (
              <EditProjectButtons
                setBugMode={setBugMode}
                createBugMode={createBugMode}
                project={project}
                setEditMode={setEditMode}
              />
            )}
            <div className="flex-column mobile-column secondary-bg b-radius">
              <b>Project Manager</b>
              <p className="p-md ">
                Name: {project.projectManager.name || "No PM"}
              </p>
              <p className="p-md">Email : {project.projectManager.email}</p>
              <a href={`/profile/${project.projectManager._id}`}>Details</a>
            </div>

            <div className="h-md">
              {ProjectTableBodyContent(project.members, user.role === "Admin")}
            </div>
            <div className="h-md">{BugTableContent(project.bugs, "Bugs")}</div>
          </div>
        </>
      ) : (
        <NoData title={"Project"} />
      )}
    </>
  );
};

export default ProjectDashboard;
