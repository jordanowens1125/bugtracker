import React, { useMemo } from 'react'
import { TextField } from '@material-ui/core'
import {useState} from 'react'
import Box from '@mui/material/Box';
import api from '../../api/index'
import { useSelector, useDispatch } from 'react-redux'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import {selectedBug, setBugs} from '../../redux/actions/bugActions'
import dayjs from 'dayjs'


const priorities =['Low','Medium','High']
const statusOptions=['Open','In Progress', 'Closed','In Review','Assigned', 'Not Assigned',]
const BugDashboard = () => {
    const bug =useSelector((state)=>state.currentBug)
    const dispatch =useDispatch()
    let {_id,title, description, status,openDate, closeDate, creator,
        priority,assignedTo,relatedBugs,projectID,comments,closer,
        stepsToRecreate,history} = bug

    const [formInputData, setFormInputData] = useState({
        title:title,
        creator:creator,
        description:description,
        status:status,
        openDate: openDate,
        closeDate: closeDate,
        priority:priority,
        assignedTo: assignedTo,
        relatedBugs:relatedBugs,
        projectID:projectID,
        comments:comments,
        stepsToRecreate:stepsToRecreate,
        history:history,
        closer:closer,
    })
    useMemo(() => {
        setFormInputData(bug)
    },[]);
  const [editMode, setEditMode] = useState(false)

  const handleInputChange=(e)=>{   
    const inputFieldValue = e.target.value;
    const inputFieldName =e.target.id||e.target.name
    //if name is start or deadline change format to string 
    const newInputValue = {...formInputData,[inputFieldName]:inputFieldValue}
    setFormInputData(newInputValue);
  }
  const handleFormSubmit= async(e)=>{ 
    e.preventDefault()  
    const result = await api.bugs.updateBug(_id,formInputData)
    setFormInputData(formInputData)
    //update redux bug
    apiCallToNewBug()
    changeEditMode()
    const updateBugs = await api.bugs.fetchBugs()
    dispatch(setBugs(updateBugs))
 }
 const apiCallToNewBug=async()=>{
    try{
        const response = await api.bugs.fetchBug(_id)
            //return 1 bug
            dispatch(selectedBug(response))
    }
    catch(err){
        console.log('Error', err)
    }
 }
 const changeEditMode=()=>{
    setEditMode(!editMode)
    //these are opposite because the value editMode starts out undefined until rendered
    if(editMode){
        setFormInputData(bug)
    }
    else{
        setFormInputData(formInputData)
    }
 }
    return (
        <>
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            >
                <h1>hiiiiiiii</h1>
                <h1>hiiiiiiii</h1>
                <h1>hiiiiiiii</h1>
                <h1> {bug.title}</h1>
                <h1> {bug.description}</h1>
                <h1> {dayjs(bug.openDate).format('YYYY-MM-DD')}</h1>
                <h1> {bug.status}</h1>
                <h1> {bug.priority}</h1>
                <h1> {bug.assignedTo}</h1>
        </Box>
        </>  
    )
}

export default BugDashboard