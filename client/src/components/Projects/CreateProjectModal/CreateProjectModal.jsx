import React,{useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import api from  '../../../api/index'
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import {setProjects} from '../../../redux/actions/projectActions'
import {setUsers} from '../../../redux/actions/userActions'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name, bugName, theme) {
    return {
      fontWeight:
        bugName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateProjectModal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const currentUser=useSelector(state=>state.currentUser)
    const checkIfUserIsAnAdmin=(user)=>{
      if(user.role==='admin'){
        return true
      }
      return false
    }
    const userIsAnAdmin = checkIfUserIsAnAdmin(currentUser)
  const [alertOpen, setAlertOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const theme = useTheme();
  const dispatch =useDispatch()
  const unAssignedUsers = useSelector((state)=>state.allUsers.unAssignedUsers)
  const [formInputData, setFormInputData] = useState({
    title:'',
    description:'',
    status:'On Track',
    startDate: dayjs(new Date()).format('YYYY-MM-DD'),
    deadline: dayjs(new Date()).format('YYYY-MM-DD'),
    history:[],
    members:[],
    bugs:[],
    client:'',
})
useEffect(()=>{
  
},[formInputData])

const handleInputChange=(e)=>{   
    const inputFieldValue = e.target.value;
    const inputFieldName = e.target.name||e.target.id;
    const NewInputValue = {...formInputData,[inputFieldName]:inputFieldValue}
    setFormInputData(NewInputValue);
  }

  function replaceEmailsWithIDs(emails, users) {
    let userIds =[];
    if(emails.length>0){
      for(let i=0;i<users.length;i++){
        if(emails.includes(users[i].email)){
            userIds.push(users[i]._id)
        }
      } 
    }
    return(userIds)  
  }
  
  const handleFormSubmit =async(e)=>{
    e.preventDefault();
    //change list of members to ids here
    const memberIds = replaceEmailsWithIDs(formInputData.members,unAssignedUsers)
    const newInputValue = {...formInputData,['members']:memberIds}
    await api.projects.createProject(newInputValue)
    const newProjects = await api.projects.fetchProjects()
    dispatch(setProjects(newProjects));
    const newUsers = await api.users.fetchUsers()
    dispatch(setUsers(newUsers));
    setAlertOpen(true)
    setModalOpen(false)
    setFormInputData(
      {title:'',
      description:'',
      status:'On Track',
      startDate: dayjs(new Date()).format('YYYY-MM-DD'),
      deadline: dayjs(new Date()).format('YYYY-MM-DD'),
      history:[],
      members:[],
      bugs:[],})
  }
  const handleModalClose=(e,reason)=>{
    if (reason === 'clickaway') {
        return;
    }
    setModalOpen(false);
}
const handleAlertClose=(e,reason)=>{
    if (reason === 'clickaway') {
        return;
    }
    setAlertOpen(false);
}
  return (
    <>
    {userIsAnAdmin? 
      <>
        <div>
          <Button variant='contained' sx={{}} onClick={handleModalOpen}>Create Project</Button>
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            <form onSubmit={(event) => handleFormSubmit(event)}> 
                  <TextField
                  required 
                  label="Title"
                  defaultValue=""
                  title={formInputData.title}
                  onChange={handleInputChange}
                  id='title'
                  />
                  <TextField
                  required
                  id="description"
                  label="Description"
                  description={formInputData.description}
                  minRows={8}
                  defaultValue=""
                  onChange={handleInputChange}
                  //multiline
                  //error comes when multiline is added
                  />
              <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Members</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                name={'members'}
                multiple
                value={formInputData.members||[]}//set to current personName list
                onChange={handleInputChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {unAssignedUsers.map((user) => (
                  <MenuItem
                    key={user._id}
                    value={user.email}
                    style={getStyles(user, user.email, theme)}
                  >
                    {user.email}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
              <TextField
                id="start"
                label='Start'
                name='start'
                type="date"
                defaultValue={formInputData.startDate}
                sx={{ width: 220 }}
                InputLabelProps={{
                shrink: true,
                }}
                onChange={handleInputChange}
              />
              <TextField
                id="deadline"
                label='Deadline'
                name='deadline'
                type="date"
                defaultValue={formInputData.deadline}
                sx={{ width: 220 }}
                InputLabelProps={{
                shrink: true,
                }}
                onChange={handleInputChange}
              />
            <Button variant="contained" onClick={(e)=>{handleFormSubmit(e)}}>
                Submit
              </Button>  
            </form>
            </Box>
          </Modal>
          <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleAlertClose}>
              <Alert onClose={handleAlertClose} variant="filled" severity="success" sx={{ width: '100%' }}>
                  Project was successfully created            
              </Alert>
          </Snackbar>
        </div>
      </>
      :
      <></>
    }
    </>
  )
}

export default CreateProjectModal