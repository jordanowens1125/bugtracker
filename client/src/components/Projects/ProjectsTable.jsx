import React from "react";
import { useEffect } from "react";
import useAuthContext from "../../hooks/useAuthContext";

const ProjectsTable = ({ projects }) => {
  const hasProjects = projects.length > 0;
  const { user } = useAuthContext();
  const isAdmin = user.role === "Admin";
  useEffect(() => {}, [projects]);
  return (
    <>
      {hasProjects ? (
        <>
          <div className="flex-column gap-md">
            <span className="flex gap-md">
              <input type="text" placeholder="Search for project" />
              <button className="button-secondary">Clear</button>
            </span>
            <div className="overflow-x only-full-width">
              <table className="padding-md full-width">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>More</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td>{project.title}</td>
                      <td>{project.description}</td>
                      <td className="flex-column gap-md">
                        <a href={`/projects/${project._id}`}> See Details</a>
                        {isAdmin && (
                          <a href={`/projects/${project._id}/managemembers`}>
                            Manage Members
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        "No projects"
      )}
    </>
  );
};

export default ProjectsTable;
