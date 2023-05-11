import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import dayjs from "dayjs";

const BugsTable = () => {
  const bugs = useSelector((state) => state.allBugs.bugs);
  const hasBugs = bugs.length > 0;
  useEffect(() => {}, [bugs]);

  return (
    <>
      {hasBugs ? (
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
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Open Date</th>
                  <th>Close Date</th>
                  <th>More</th>
                </tr>
              </thead>
              <tbody>
                {bugs.map((bug) => (
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
        <h1>Loading</h1>
      )}
    </>
  );
};

export default BugsTable;
