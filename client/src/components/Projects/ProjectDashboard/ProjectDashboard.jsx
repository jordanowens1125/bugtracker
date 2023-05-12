import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "../../Loading";
import EditProjectModal from "../EditProjectModal/EditProjectModal";

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

const ProjectDashboard = ({ project }) => {
  const user = useSelector((state) => state.currentUser);
  const userIsAdmin = user.role === "Admin";
  const userIsAssignedToProject = checkIfUserIsAssignedToProject(user, project);
  const isCurrentProjectFilled = checkProject(project);
  useEffect(() => {}, [project, userIsAdmin, userIsAssignedToProject, user]);

  return (
    <>
      {isCurrentProjectFilled ? (
        <>
          <div className=" flex-column p-md gap-lg full-vh full-width">
            <a href="/projects">Back to Projects</a>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <span>
              <EditProjectModal project={project} />
            </span>

            <div className="flex gap-lg full-width space-between full-height ">
              <div className="flex-column gap-lg">
                <a
                  href={`/projects/${project._id}/managemembers`}
                  className="p-md"
                >
                  Manage Members
                </a>
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
              <div className="flex-column gap-lg">
                <a href={`/Bugs/${project._id}/manageassignments`}>
                  Manage Bug Assignments
                </a>
                <table className="padding-md full-width">
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
                            <td>
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
