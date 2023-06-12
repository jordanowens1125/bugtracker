import api from "../api";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import NoData from "../components/Shared/NoData";
import useAuthContext from "../hooks/useAuthContext";

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
        <h1>Bugs</h1>

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
          </span>
          {hasBugs ? (
            <>
              <div className="overflow-x only-full-width">
                <table className="padding-md full-width">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Open Date</th>
                      <th>Close Date</th>
                      <th>More</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((bug) => (
                      <tr key={bug._id}>
                        <td>{bug.title}</td>
                        <td>{bug.description}</td>
                        <td>{bug.priority}</td>
                        <td>{bug.status}</td>
                        <td>{dayjs(bug.openDate).format("YYYY-MM-DD")}</td>
                        <td>{dayjs(bug.deadline).format("YYYY-MM-DD")}</td>
                        <td className="flex-column gap-md">
                          <a href={`/bugs/${bug._id}`}> See Details</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
