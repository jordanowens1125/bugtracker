import React, { useState,useRef,useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../../../api/index'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from 'react-redux'
import { removeSelectedBug, selectedBug} from '../../../redux/actions/bugActions'
import Comment from '../Comment/Comment';
import EditBugModal from '../EditBugModal/EditBugModal';
import { setUsers } from '../../../redux/actions/userActions';
import { selectedProject, setProjects } from '../../../redux/actions/projectActions';

const bugHasComments=(bug)=>{
    if(bug.comments){
        if(bug.comments.length>0){
            return true
        }
    }
    return false 
}
const checkifCurrentBugIsFilled=(obj)=>{
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return true;
    }
    return false;
}
const checkIfUserCanMakeComments=(user,bug)=>{
    if(user){
        if(bug){
            if(user.role=='admin'){
                return true
            }
            else if(true){
                if(bug.assignedTo){
                    if(bug.assignedTo.includes(user._id)){
                        return true
                    }
                }
            }
        }
    }
    return false
}
const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div id='bottom' ref={elementRef} />;
  };

  const scrollToBottom = () => {
    const section = document.querySelector( '#bottom' );
    if(section){
        section.scrollIntoView( { behavior: 'smooth', block: 'start' } );
    }
  };
const BugComments = () => {
    const currentUser =useSelector((state)=>state.currentUser)
    const bug =useSelector((state)=>state.currentBug)
    const currentProject = useSelector((state)=>state.project)
    const isThereACurrentBug=checkifCurrentBugIsFilled(bug)
    const hasComments=bugHasComments(bug)
    
    const canUserMakeCommentsOnThisBug=checkIfUserCanMakeComments(currentUser,bug)

    const [chatInput,setChatInput]= useState({
        text:'',
        input:'',
    })
    

    const dispatch=useDispatch()
    const clearCurrentBug=()=>{
        dispatch(removeSelectedBug())
    }


    const handleChange=(e)=>{
        const inputFieldValue = e.target.value;
        const inputFieldName =e.target.id||e.target.name//target name for the bugs select
        //if name is start or deadline change format to string
        const newInputValue = {...chatInput,[inputFieldName]:inputFieldValue}
        setChatInput(newInputValue);
    }
    const sendComment=async(e)=>{
        e.preventDefault()
        if(chatInput.text!=''){
            const newComment = {...chatInput}
            newComment.creator=currentUser._id
            newComment.bugID=bug._id
            //bug projectID property is a project object so get id
            newComment.projectID=currentProject._id
            await api.comments.createComment(newComment)
            const newBug = await api.bugs.fetchBug(bug._id)
            const newProject = await api.projects.fetchProject(currentProject._id)
            const updatedProjects = await api.projects.fetchProjects()
            dispatch(selectedBug(newBug))
            dispatch(selectedProject(newProject))
            dispatch(setProjects(updatedProjects))
            setChatInput({
                text:'',
                input:'',
            })
            const updatedUsers =await api.users.fetchUsers()
            dispatch(setUsers(updatedUsers))
        }
        
    }
    
    useEffect(()=>{
    },[bug])
  return (
    <>
    {isThereACurrentBug?
    <Paper elevation={5} sx={{marginTop:60,}}>
            <Box p={3}>
                <Typography variant='h4' gutterBottom>{bug.title}</Typography>
                <Button variant ='contained' onClick={clearCurrentBug}>Clear Bug</Button>
                <Button variant ='contained' onClick={scrollToBottom}>Scroll To bottom</Button>
                <EditBugModal/>
                <Divider/>
                <Grid 
                sx={{
                    overflow: "hidden",
                    overflowY: "scroll",
                    maxHeight:500,
                }}>
                     <Grid item>
                        <List>
                            {hasComments?
                            <>
                            <div>{bug.comments.map((comment)=>(
                                    <div key={comment._id}>
                                        <Comment comment={comment}/>
                                    </div>
                                ))}
                            </div><AlwaysScrollToBottom />
                            </>
                                :<div>no comments</div>
                            }
                        </List>
                     </Grid>
                     {canUserMakeCommentsOnThisBug?
                        <form onSubmit={sendComment}>
                            <Grid xs={8} item>
                            <FormControl fullWidth>
                                <TextField 
                                id='text'
                                value={chatInput.text}
                                label='Type your message'
                                variant='outlined'
                                onChange={handleChange}
                                />
                            </FormControl>
                            </Grid>
                            <Grid xs={4} item>
                                <IconButton
                                aria-label='send'
                                color='primary'
                                type='submit'>
                                    <SendIcon/>
                                </IconButton>
                            </Grid>
                        </form>                        
                        :
                        <></>
                     }
                </Grid>
            </Box>
        </Paper>:
        <h1>Selected Bug Info</h1>
    }
    </>
  )
}

export default BugComments