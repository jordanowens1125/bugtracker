import React,{useState,useEffect,useMemo} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
import { setBugs,selectedBug } from '../../../redux/actions/bugActions';
import {setProjects} from '../../../redux/actions/projectActions'

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

  function getStyles(name, bugName, theme) {
    return {
      fontWeight:
        bugName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const priorities =['Low','Medium','High']

const EditBugModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const projects = useSelector((state)=>state.allProjects.projects)
  const bugs = useSelector((state)=>state.allBugs.bugs)
  const currentBug = useSelector((state)=>state.currentBug)
  const users = useSelector((state)=>state.allUsers.users)
  //
  const theme = useTheme();
  const dispatch =useDispatch()
  const [formInputData, setFormInputData] = useState({
    title:'',//set by user, can be updated *
    creator:'',//auto
    description:'',//set by user, can be updated *
    status:'Open',//can be updated *
    projectID:'',//set by user *
    closer:'',//auto
    openDate: dayjs(new Date()).format('YYYY-MM-DD'),//set by user-optionally
    closeDate: '',//auto 
    history:[],//auto
    relatedBugs:[],//set by user optionally, can be updated
    stepsToRecreate:[],//set by user, can be updated
    priority:'Low',//set by user, can be updated *
    assignedTo:null,//can be updated
    comments:[],
})
useMemo(()=>{
    setFormInputData(currentBug)
},[currentBug])
const handleInputChange=(e)=>{ 
    const inputFieldValue = e.target.value;
    const inputFieldName =e.target.id||e.target.name//target name for the bugs select
    //if name is start or deadline change format to string
    const newInputValue = {...formInputData,[inputFieldName]:inputFieldValue}
    setFormInputData(newInputValue);
}

const handleFormSubmit=async(e)=>{  
    e.preventDefault()
    const result = await api.bugs.updateBug(currentBug._id,formInputData)
    dispatch(selectedBug(formInputData))
    const newBugs = await api.bugs.fetchBugs()
    dispatch(setBugs(newBugs))
    const newProjects = await api.projects.fetchProjects()
    dispatch(setProjects(newProjects))
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
    <div>
    <Button onClick={handleModalOpen}>Edit Bug</Button>
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
            title={formInputData.title}
            onChange={handleInputChange}
            id='title'
            />
            <FormControl>
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
            </FormControl>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-name-label">Priority</InputLabel>
                <Select
                id="priority"
                name='priority'
                value={formInputData.priority}
                onChange={handleInputChange}
                input={<OutlinedInput label="Priority" />}
                required
                >
                {priorities.map((priority) => (
                    <MenuItem
                        key={priority}
                        value={priority}
                        >
                        {priority}
                    </MenuItem>
                ))}
                </Select>
            </FormControl> 
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Related bugs</InputLabel>
                    <Select
                    labelId="demo-multiple-chip-label"
                    id="relatedBugs"
                    name={'relatedBugs'}
                    multiple
                    value={formInputData.relatedBugs}//set to current bugsName list
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
                    {bugs.map((bug) => (
                        <MenuItem
                        key={bug._id}
                        value={bug._id}
                        style={getStyles(bug, bug.title, theme)}
                        >
                        {bug.title}
                        </MenuItem>
                    ))}
                    </Select>
            </FormControl> 
      <input type="submit" value="Submit" onSubmit={(e)=>{handleFormSubmit(e)}}></input>  
      </form>
      </Box>
    </Modal>
    <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} variant="filled" severity="success" sx={{ width: '100%' }}>
            Bug {currentBug.title} was successfully edit       
        </Alert>
    </Snackbar>
  </div>
  )
}

export default EditBugModal