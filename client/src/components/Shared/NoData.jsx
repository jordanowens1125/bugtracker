import React from "react";

const NoData = ({ title = "Tickets", caption }) => {
  return (
    <div className="flex-column mobile-text-align">
      <p className="primary p-md">{caption}</p>
      <div className="nodata secondary mobile-text-align">
        <b>No {title} To Display</b>
      </div>
    </div>
  );
};

export default NoData;
