import React, { useState } from "react";
import { useEffect } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import NoData from '../Shared/NoData'

const ProjectsTable = ({ projects }) => {
  const { user } = useAuthContext();
  const [input, setInput] = useState("");
  const CanManageMembers =
    user.role === "Admin" || user.role === "Project Manager";
  const filtered = projects.filter((project) => {
    const capitalizedTitle = project.title.toUpperCase();
    return capitalizedTitle.includes(input.toUpperCase());
  });
  const hasProjects = filtered.length > 0;
  const handleInputChange = (e) => {
    setInput(e.currentTarget.value);
  };
  useEffect(() => {}, [projects]);
  return (
    <>
      <div className="flex-column gap-md mobile-column page">
        <span className="flex gap-md mobile-column">
          <input
            type="text"
            placeholder="Search By Project Title"
            value={input}
            onChange={handleInputChange}
          />
          <button className="button-secondary" onClick={() => setInput("")}>
            Clear
          </button>
        </span>
        {hasProjects ? (
          <>
            <div className="overflow-x only-full-width">
              <table className="p-md full-width">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>More</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project) => (
                    <tr key={project._id}>
                      <td>{project.title}</td>
                      <td>{project.description}</td>
                      <td className="flex-column gap-md">
                        <a href={`/projects/${project._id}`}> See Details</a>
                        {CanManageMembers && (
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
          </>
        ) : (
          <NoData title={"Projects"} />
        )}
      </div>
    </>
  );
};

export default ProjectsTable;
