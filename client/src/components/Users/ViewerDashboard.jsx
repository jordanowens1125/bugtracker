import React from 'react'
import  Button  from '@mui/material/Button';
import { useEffect } from 'react';

const ViewerDashboard = () => {
    const handleRequest = () => {
        
    }
    useEffect(()=>{})
    return (
      <>
        <div>Viewer Dashboard</div>
        <div>
          <p>
            You are currently unassigned to any projects because you are only a
            viewer.
          </p>
          <p>
            Feel free to look around.
          </p>
          {/* <p>
            Request to change roles below!
          </p>
          <div>
            <Button onClick={handleRequest}>Submit Request</Button>
          </div> */}
        </div>
      </>
    );
}

export default ViewerDashboard