import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {Box} from '@mui/material';
import DeveloperDashboard from './DeveloperDashboard';
import AdminDashboard from './AdminDashboard';

const UserDashboard = () => {
    const user = useSelector((state)=>state.currentUser)
    const isUserAnAdmin = user.role==='admin'    
    const isUserADeveloper=user.role==='developer'
    const isUserAViewer=user.role==='viewer'
      useEffect(()=>{

      },[user])
    return (
      <>{isUserAnAdmin? 
          <>
            <AdminDashboard/>
          </>        
          :<></>
          }
          {
            isUserADeveloper?
            <>
              <DeveloperDashboard/>
            </>
            
            :<></>
          }
          {
            isUserAViewer?
            <>
              <Box sx={{ height: 400, width: '100%',paddingBottom:10, }}>
                hi
              </Box>
              <Box>
              </Box>
            </>
            :<></>
          }
      </>
    )
  }

export default UserDashboard