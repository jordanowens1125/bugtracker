import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index";
import BugComments from "../components/Bugs/BugComments/BugComments";

const Bug = () => {
  const { id } = useParams();
  const [bug, setBug] = useState("");
  useEffect(() => {
    const fetchBug = async () => {
      const request = await api.bugs.fetchBug(id);
      setBug(request);
    };
    fetchBug();
  }, [id]);
  return (
    <div className="bug-page">
      {bug && (
        <>
          <a href={`/projects/${bug.projectID}`}>Go to bug project</a>
          <section className="p-md gap-md flex-colum">
            <span className="flex gap-lg">
              <h1>Title: {bug.title}</h1>
              <a href={`bugs/${bug._id}/edit`} >Edit</a>
            </span>

            <p>Description: {bug.description}</p>
            {/* Need Project title */}
            <p>Project Title: {bug.projectID}</p>
            <p>Assigned To: {bug.assignedTo[0]?.name || "-"}</p>
            <p>Priority: {bug.priority}</p>
          </section>
          <div className="p-md full-height overflow-y">
            <BugComments bug={bug} />
          </div>
        </>
      )}
      {!bug && <>No bug found</>}
    </div>
  );
};

export default Bug;
