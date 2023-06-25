import dayjs from "dayjs";
import BugComments from '../Bugs/BugComments'

const BugInfo = ({ bug, canEdit, setEditMode }) => {
  return (
    <>
      <section className="p-md gap-md flex-column mobile-column jcc">
        <a href={`/projects/${bug.projectID?._id || "-"}`} className="p-top-lg">
          Go To Bug Project
        </a>

        <>
          {/* Only admin and project managers can change these */}
          <h1>Title: {bug.title}</h1>
          <p>Description: {bug.description}</p>
          {/*  */}
          <p>Project Title: {bug.projectID.title}</p>
          <p>Assigned To: {bug.assignedTo?.name || "Not Assigned"}</p>
          <p>Priority: {bug.priority}</p>
          <p>Status: {bug.status}</p>
          <p>Start: {dayjs(bug.openDate).format("YYYY-MM-DD")}</p>
          <p>Deadline: {dayjs(bug.deadline).format("YYYY-MM-DD")}</p>
          <span>
            {canEdit && (
              <button
                className="button-secondary"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            )}
          </span>
        </>
      </section>
      <div className="h-xl overflow-y comments-section">
        <BugComments bug={bug} />
      </div>
    </>
  );
};

export default BugInfo;
