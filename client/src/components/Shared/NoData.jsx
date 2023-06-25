import React from "react";

const NoData = ({ title = "Bugs", caption }) => {
  return (
    <div className="flex-column mobile-text-align">
      <p className="primary">{caption}</p>
      <div className="nodata secondary mobile-text-align">
        <b>No {title} To Display</b>
      </div>
    </div>
  );
};

export default NoData;
