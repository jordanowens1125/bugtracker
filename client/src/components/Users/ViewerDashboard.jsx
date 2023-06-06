import React from 'react'
import { useEffect } from 'react';

const ViewerDashboard = () => {
    useEffect(()=>{})
    return (
      <>
        <h1>Viewer Dashboard</h1>
        <div>
          <p>
            You are currently unassigned to any projects because you are only a
            viewer.
          </p>
          <p>Feel free to look around.</p>
          {/* <p>
            Request to change roles below!
          </p>
          <div>
            <Button aria-label='Submit request to change roles' onClick={handleRequest}>Submit Request</Button>
          </div> */}
        </div>
      </>
    );
}

export default ViewerDashboard