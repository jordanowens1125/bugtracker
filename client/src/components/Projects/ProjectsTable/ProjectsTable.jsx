import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const ProjectsTable = () => {
  const projects = useSelector((state) => state.allProjects.projects);
  const hasProjects = projects.length > 0;

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
                        <a href={`/projects/${project._id}/managemembers`}>
                          Manage Members
                        </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        "No projects"
      )}
    </>
  );
};

export default ProjectsTable;
