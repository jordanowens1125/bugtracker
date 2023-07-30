import api from "../api";
import React, { useEffect, useState } from "react";
import NoData from "../components/Shared/NoData";
import useAuthContext from "../hooks/useAuthContext";
import Table from "../components/Shared/Table";
import TicketsTableBody from "../components/Tickets/TicketsTableBody";
import Select from "../components/Shared/Select";
import Error from "../components/Shared/Error";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const { user } = useAuthContext();
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.currentTarget.value);
  };

  let filtered = tickets.filter((project) => {
    const capitalizedTitle = project.title.toUpperCase();
    return capitalizedTitle.includes(input.toUpperCase());
  });

  if (priority !== "") {
    filtered = filtered.filter((project) => {
      return project.priority === priority;
    });
  }

  if (status !== "") {
    filtered = filtered.filter((project) => {
      return project.status === status;
    });
  }

  const hasTickets = filtered.length > 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.tickets.fetchTickets(user);
        setTickets(response);
      } catch (error) {
        setError(
          `Unable to get tickets because of the following error: ${error.message}`
        );
      }
    };
    fetchData();
  }, [user]);
  return (
    <>
      <div className="flex-column gap-md page">
        <div className="flex mobile-column">
          <h1>Tickets</h1>
          <Error text={error} textAlign={true}/>
        </div>

        <div className="flex-column gap-md mobile-column">
          <div className="flex space-between mobile-column">
            <span className="flex aic jcc">
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
            <div className="flex gap-lg">
              <div className="flex aic jcc no-wrap mobile-column">
                <Select
                  label={"Status"}
                  value={status}
                  placeholder={"Any Status"}
                  listofOptions={["In Progress", "Closed", "In Review", "Open"]}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>
              <div className="flex aic jcc no-wrap mobile-column">
                <Select
                  label={"Priority"}
                  value={priority}
                  placeholder={"Any Priority"}
                  listofOptions={["Low", "Medium", "High"]}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>
            </div>
          </div>

          {hasTickets ? (
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
                  content={<TicketsTableBody tickets={filtered} />}
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

export default Tickets;
