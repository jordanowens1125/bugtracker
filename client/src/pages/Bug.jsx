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
    <div>
      {bug && (
        <>
          <a href={`/projects/${bug.projectID}`}>Go to bug project</a>
          <div className="flex space-between">
            <div className="flex-column gap-md">
              <h1>{bug.title}</h1>
              <p>{bug.description}</p>
              {/* Need Project title */}
              <p>Project Title: {bug.projectID}</p>

              <p>Assigned To: {bug.assignedTo[0]?.name || "-"}</p>
              <p>Priority: {bug.priority}</p>
            </div>
            <BugComments bug={bug} />
          </div>
        </>
      )}
    </div>
  );
};

export default Bug;
