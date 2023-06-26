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
      {editMode && (
        <>
          <EditProjectModal
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            edit={edit}
          />
        </>
      )}
      {isCurrentProjectFilled ? (
        <>
          <div className="page flex-column">
            <a href="/projects">All Projects</a>
            <h1>{projectDisplay.title}</h1>
            <p>{projectDisplay.description}</p>
            {userCanEdit && (
              <EditProjectButtons
                setBugMode={setBugMode}
                createBugMode={createBugMode}
                project={project}
                setEditMode={setEditMode}
              />
            )}
            <div className="h-lg">
                {ProjectTableBodyContent(
                  project.members,
                  user.role === "Admin"
                )}
            </div>
            <div className="h-lg">
                {BugTableContent(project.bugs, "Bugs")}
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
