import api from "../api";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import NoData from "../components/Shared/NoData";
import useAuthContext from "../hooks/useAuthContext";
import Table from "../components/Shared/Table";
import Select from '../components/Shared/Select'
// import statusList from '../constants/bug'

const TableBodyElement = (bugs) => {
  return (
    <>
      {bugs.map((bug) => (
        <tr key={bug._id}>
          <td>{bug.title}</td>
          <td>{bug.description}</td>
          <td>{bug.priority}</td>
          <td>{bug.status}</td>
          <td>{dayjs(bug.deadline).format("YYYY-MM-DD")}</td>
          <td className="flex-column gap-md">
            <a href={`/bugs/${bug._id}`}> See Details</a>
          </td>
        </tr>
      ))}
    </>
  );
};

const Bugs = () => {
  const [bugs, setBugs] = useState([]);
  const { user } = useAuthContext();
  const [input, setInput] = useState("");
  const handleInputChange = (e) => {
    setInput(e.currentTarget.value);
  };

  const filtered = bugs.filter((project) => {
    const capitalizedTitle = project.title.toUpperCase();
    return capitalizedTitle.includes(input.toUpperCase());
  });

  const hasBugs = filtered.length > 0;

  const headings = [
    "Title",
    "Description",
    "Priority",
    "Status",
    "Deadline",
    "More",
  ];
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.bugs.fetchBugs(user);
      setBugs(response);
    };
    fetchData();
  }, [user]);
  return (
    <>
      <div className="flex-column gap-md page mobile-column">
        <h1>Tickets</h1>

        <div className="flex-column gap-md mobile-column">
          <span className="flex gap-md">
            <input
              type="text"
              placeholder="Search By Title..."
              value={input}
              onChange={handleInputChange}
            />
            <button className="button-secondary" onClick={() => setInput("")}>
              Clear
            </button>
            {/* <Select label={''} value={'Status'} listofOptions={statusList}/> */}
          </span>
          {hasBugs ? (
            <>
              <div className="overflow-x only-full-width">
                <Table
                  headings={headings}
                  content={TableBodyElement(filtered)}
                />
              </div>
            </>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </>
  );
};

export default Bugs;
