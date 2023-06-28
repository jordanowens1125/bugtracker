import React from "react";

const EditProjectButtons = ({
  setEditMode,
  createTicketMode,
  setTicketMode,
}) => {
  return (
    <div className="flex mobile-column">
      <button className="button-primary" onClick={() => setEditMode(true)}>
        Edit Project
      </button>
      <button
        className="button-secondary"
        disabled={createTicketMode}
        onClick={() => setTicketMode(true)}
      >
        Add New Ticket
      </button>
    </div>
  );
};

export default EditProjectButtons;
