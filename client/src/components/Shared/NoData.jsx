import React from "react";

const NoData = ({ title = "Bugs", caption }) => {
  return (
    <div className="flex-column">
      <p className="primary">{caption}</p>
      <div className="nodata secondary text-align">
        <b>No {title} To Display</b>
      </div>
    </div>
  );
};

export default NoData;
