import React, { useEffect, useState } from "react";
import NoData from "../Shared/NoData";
import api from "../../api";
import useAuthContext from "../../hooks/useAuthContext";
import useMessageContext from "../../hooks/messageContext";
import EditProjectModal from "./EditProjectModal";
import ProjectTableBodyContent from "./ProjectTableBodyContent";
import TicketTableContent from "./TicketTableContent";
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
  createticketMode,
  setTicketMode,
  available,
  setProject,
  setAvailable,
}) => {
  const { user } = useAuthContext();
  const userCanEdit = user.role === "Admin" || user.role === "Project Manager";
  const isCurrentProjectFilled = checkProject(project);
  const [editMode, setEditMode] = useState(false);
  const [edit, setEdit] = useState();
  const [projectDisplay, setProjectDisplay] = useState(project);
  const messageInfo = useMessageContext();
  const [PMChanged, setPMChanged] = useState(false);
  const [selected, setSelected] = useState({});

  const handleChange = (e) => {
    const copy = { ...edit };
    copy[e.currentTarget.name] = e.currentTarget.value;
    setEdit(copy);
    if (e.currentTarget.name === "projectManager") {
      setPMChanged(true);
    }
  };

  const handleCancel = () => {
    setEdit(project);
    setEditMode(false);
    setSelected(
      project.members.reduce(function (result, item) {
        result[item._id] = true;
        return result;
      }, {})
    );
  };

  const handleDevSelect = (e, developer) => {
    const copy = { ...selected };
    if (copy[developer._id]) {
      e.target.classList.remove("selected");
      delete copy[developer._id];
    } else {
      e.target.classList.add("selected");
      copy[developer._id] = developer;
    }
    setSelected(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bugIds = edit.bugs.map((bug) => bug._id);
    let pmID = edit.projectManager._id;
    let pm = edit.projectManager;
    if (PMChanged) {
      pmID = edit.projectManager;
      pm = available.find((user) => user._id === pmID);
    }

    const devIDs = Object.keys(selected);

    const newProjectDisplay = {
      ...edit,
      projectManager: pm,
      members: devIDs.map((userid) => selected[userid]),
    };

    const updatedProject = {
      ...edit,
      bugs: bugIds,
      projectManager: pmID,
      members: devIDs,
    };

    try {
      await api.projects.updateProject(user, project._id, updatedProject);
      setProjectDisplay(newProjectDisplay);
      setProject(newProjectDisplay);
      setEdit(edit);
      setEditMode(false);
      //remove selected users
      let unSelectedUsers = available.filter(
        (user) => !devIDs.find((id) => id === user._id)
      );
      if (PMChanged) {
        //remove new pm from available
        unSelectedUsers = unSelectedUsers.filter((user) => user._id !== pmID);
        //add old project manager from project to new available
        unSelectedUsers = [...unSelectedUsers, project.projectManager];
      }

      setAvailable(unSelectedUsers);
      messageInfo.dispatch({
        type: "SHOW",
        payload: `Project ${edit.title} has been successfully edited!`,
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (project) {
      
      setEdit(project);
      setProjectDisplay(project);
      setSelected(
        project.members.reduce(function (result, item) {
          result[item._id] = item;
          return result;
        }, {})
      );
    }
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
            handleDevSelect={handleDevSelect}
            selected={selected}
          />
        </>
      )}
      {isCurrentProjectFilled ? (
        <>
          <div className="flex-column only-full-width">
            <h1>{projectDisplay.title}</h1>
            <p>Description: {projectDisplay.description}</p>
            {userCanEdit && (
              <EditProjectButtons
                setTicketMode={setTicketMode}
                createticketMode={createticketMode}
                project={project}
                setEditMode={setEditMode}
              />
            )}
            <div className="mobile-column p-md">
              <i className="secondary">Project Manager</i>
            </div>
            <div className="flex-column mobile-column secondary-bg b-radius">
              <p className="p-md ">
                Name: {project?.projectManager?.name || "No PM"}
              </p>
              <p className="p-md">Email : {project?.projectManager?.email}</p>
              {user.role === "Admin" && (
                <a href={`/profile/${project.projectManager?._id}`}>Details</a>
              )}
            </div>

            <div className="h-md">
              {ProjectTableBodyContent(project.members, user.role === "Admin")}
            </div>
            {/* <div className="h-md"> */}
              {TicketTableContent(project.bugs, "Tickets")}
            {/* </div> */}
          </div>
        </>
      ) : (
        <NoData title={"Project"} />
      )}
    </>
  );
};

export default ProjectDashboard;
