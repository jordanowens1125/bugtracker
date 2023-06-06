import React from 'react'

const NoData = ({ title = 'Bugs' }) => {
  
  return (
    <div className="nodata secondary">
      <b>No {title} To Display</b>
    </div>
  );
}

export default NoData