import React,{useState,useMemo} from 'react'
import api from  '../../../api/index'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux';
import MuiAlert from '@mui/material/Alert';
import {setProjects,selectedProject} from '../../../redux/actions/projectActions'
import {setUsers} from '../../../redux/actions/userActions'
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const checkIfUserIsAdmin = (user) => {
  if (user)
  {
    if (user.role == 'admin')
    {
      return true
    }
  }
  return false
}

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

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

const EditProjectModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const user = useSelector((state)=>state.currentUser)
  const isAdminUser = checkIfUserIsAdmin(user)
  const handleModalOpen = () => setModalOpen(true);
  const currentProject = useSelector((state)=>state.project)
  const availableMembers = useSelector((state)=>state.availableMembers)
  const dispatch =useDispatch()
  const [formInputData, setFormInputData] = useState({
    title:'',
    description:'',
    status:'On Track',
    startDate: dayjs(new Date()).format('YYYY-MM-DD'),
    deadline: dayjs(new Date()).format('YYYY-MM-DD'),
    history:[],
    members:[],
    bugs:[],
    completionDate:'',
    client:'',
})
  useMemo(()=>{
    if(currentProject.members){
      const newInputValue= {...currentProject}
      newInputValue.members = currentProject?.members.map(i=>i._id)
      setFormInputData(newInputValue)
    }
},[currentProject])

const handleInputChange=(e)=>{ 
    const inputFieldValue = e.target.value;
    const inputFieldName =e.target.id||e.target.name//target name for the bugs select
    const newInputValue = {...formInputData,[inputFieldName]:inputFieldValue}
    setFormInputData(newInputValue);
}

const handleFormSubmit=async(e)=>{  
    e.preventDefault()
    await api.projects.updateProject(currentProject._id,currentProject, formInputData)
    const updatedProject = await api.projects.fetchProject(currentProject._id)
    dispatch(selectedProject(updatedProject))
    const newProjects = await api.projects.fetchProjects()
    dispatch(setProjects(newProjects))
    const newUsers = await api.users.fetchUsers()
    dispatch(setUsers(newUsers))
    setAlertOpen(true)
    setModalOpen(false)
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
      {isAdminUser ? 
      <>
        <Button onClick={handleModalOpen}>Edit Project</Button>
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
                defaultValue={formInputData.title}
                onChange={handleInputChange}
                id='title'
                />
                <TextField
                required
                id="description"
                label="Description"
                description={formInputData.description}
                minRows={8}
                defaultValue={formInputData.description}
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
                    <Chip  key={value} avatar={<Avatar></Avatar>} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {availableMembers.map((user) => (
                <MenuItem
                  key={user._id}
                  value={user._id}
                  label={user.email}
                >
                   <Checkbox checked={formInputData.members.includes(user._id)} />
                  <ListItemText  key={user._id} primary={user.email} />
                </MenuItem>
              ))}
            </Select>
            </FormControl>
            <TextField
              id="start"
              label='Start'
              name='start'
              type="date"
              defaultValue={dayjs(formInputData.startDate).format('YYYY-MM-DD')}
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
              defaultValue={dayjs(formInputData.deadline).format('YYYY-MM-DD')}
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
                Project {currentProject.title} was successfully edited          
            </Alert>
        </Snackbar>
      </>
        :
      <></>}
    </>
  )
}
export default EditProjectModal