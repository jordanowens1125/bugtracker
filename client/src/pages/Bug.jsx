import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index";
import BugComments from "../components/Bugs/BugComments/BugComments";

const Bug = () => {
  const { id } = useParams();
  const [bug, setBug] = useState("");
  console.log(bug);
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
          {bug.title}
          {bug.description}
          {bug.assignedTo[0]?.name||'-'}
          {bug.priority}
          {/* Need Project title */}
          {bug.projectID}
          <BugComments bug={bug} />
        </>
      )}
    </div>
  );
};

export default Bug;
