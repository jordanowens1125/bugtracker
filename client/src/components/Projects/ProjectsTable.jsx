import React, { useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import NoData from "../Shared/NoData";
import Table from "../Shared/Table";

const TableBodyElement = (projects, CanManageMembers) => {
  return (
    <>
      {projects.map((project) => (
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
    </>
  );
};

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

  const headings = ["Title", "Description", "More"];

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
              <Table
                headings={headings}
                content={TableBodyElement(filtered, CanManageMembers)}
              />
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
