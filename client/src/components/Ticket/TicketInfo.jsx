import dayjs from "dayjs";
import TicketComments from "./TicketComments";

const TicketInfo = ({ ticket, canEdit, setEditMode }) => {
  return (
    <>
      <section className="p-md gap-md flex-column mobile-column jcc">
        <a href={`/projects/${ticket.projectID?._id || "-"}`}>To Ticket Project</a>

        <>
          <div className="p-md flex-column mobile-column jcc">
            {/* Only admin and project managers can change these */}
            <h1>Title: {ticket.title}</h1>
            <p>Description: {ticket.description}</p>
            {/*  */}
            <p>Project Title: {ticket.projectID.title}</p>
            <p>Assigned To: {ticket.assignedTo?.name || "Not Assigned"}</p>
            <p>Priority: {ticket.priority}</p>
            <p>Status: {ticket.status}</p>
            <p>Start: {dayjs(ticket.openDate).format("YYYY-MM-DD")}</p>
            <p>Deadline: {dayjs(ticket.deadline).format("YYYY-MM-DD")}</p>
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
          </div>
        </>
      </section>
      <div className="h-xl overflow-y comments-section full-width">
        <TicketComments ticket={ticket} />
      </div>
    </>
  );
};

export default TicketInfo;
