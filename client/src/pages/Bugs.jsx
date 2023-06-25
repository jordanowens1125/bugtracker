import api from "../api";
import React, { useEffect, useState } from "react";
import NoData from "../components/Shared/NoData";
import useAuthContext from "../hooks/useAuthContext";
import Table from "../components/Shared/Table";
import BugsTableBody from "../components/Bugs/BugsTableBody";

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
          </span>
          {hasBugs ? (
            <>
              <div className="overflow-x only-full-width">
                <Table
                  headings={[
                    "Title",
                    "Description",
                    "Priority",
                    "Status",
                    "Deadline",
                    "More",
                  ]}
                  content={<BugsTableBody bugs={filtered} />}
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
