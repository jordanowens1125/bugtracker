import React from "react";

const NoData = ({ title = "Tickets", caption }) => {
  return (
    <div className="flex-column text-align">
      <p className="primary">{caption}</p>
      <div className="nodata secondary text-align">
        <b>No {title} To Display</b>
      </div>
    </div>
  );
};

export default NoData;
