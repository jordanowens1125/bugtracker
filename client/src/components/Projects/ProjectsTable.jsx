import React, { useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import NoData from "../Shared/NoData";
import Table from "../Shared/Table";
import Select from "../Shared/Select";

const TableBodyElement = (projects, CanManageMembers) => {
  return (
    <>
      {projects.map((project) => (
        <tr key={project._id}>
          <td>{project.title}</td>
          <td>{project.description}</td>
          <td>{project.status}</td>
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
  const [status, setStatus] = useState("");

  const CanManageMembers =
    user.role === "Admin" || user.role === "Project Manager";
  
  let filtered = projects.filter((project) => {
    const capitalizedTitle = project.title.toUpperCase();
    return capitalizedTitle.includes(input.toUpperCase());
  });
  
  const hasProjects = filtered.length > 0;
  const handleInputChange = (e) => {
    setInput(e.currentTarget.value);
  };

  const Reset = () => {
    setInput("");
  };

  if (status !== "") {
    filtered = filtered.filter((project) => {
      return project.status === status;
    });
  }

  return (
    <>
      <div className="flex-column gap-md mobile-column page">
        <span className="flex gap-md mobile-column space-between">
          <div className="flex aic jcc">
            <input
              type="text"
              placeholder="Search By Project Title"
              value={input}
              onChange={handleInputChange}
            />
            <button className="button-secondary" onClick={Reset}>
              Reset
            </button>
          </div>

          <div className="flex aic jcc no-wrap mobile-column">
            <Select
              label={"Status"}
              value={status}
              placeholder={"Any Status"}
              listofOptions={["On Track", "Production", "Development"]}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </span>

        {hasProjects ? (
          <>
            <div className="overflow-x only-full-width">
              <Table
                headings={["Title", "Description", "Status", "More"]}
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
