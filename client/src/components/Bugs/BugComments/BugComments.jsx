import React, { useState,useRef,useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../../../api/index'
import {Typography, Paper,Box, Divider, Grid, List, FormControl, TextField, IconButton} from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from 'react-redux'
import { removeSelectedBug, selectedBug} from '../../../redux/actions/bugActions'
import Comment from '../Comment/Comment';
import EditBugModal from '../EditBugModal/EditBugModal';
import { setUsers } from '../../../redux/actions/userActions';
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
    const dispatch=useDispatch()
    const [chatInput,setChatInput]= useState({
        text:'',
        input:'',
    })
    const handleChange=(e)=>{
        const inputFieldValue = e.target.value;
        const inputFieldName =e.target.id||e.target.name//target name for the bugs select
        //if name is start or deadline change format to string
        const newInputValue = {...chatInput,[inputFieldName]:inputFieldValue}
        setChatInput(newInputValue);
    }
    const sendComment=async(e)=>{
        const newComment = {...chatInput}
        newComment.creator='63a36a4d3f0f5cf676acf07c'
        newComment.bugID=bug._id
        newComment.projectID=bug.projectID
        await api.comments.createComment(newComment)
        const newBug = await api.bugs.fetchBug(bug._id)
        dispatch(selectedBug(newBug))
        setChatInput({
            text:'',
            input:'',
        })
        const updatedUsers =await api.users.fetchUsers()
        dispatch(setUsers(updatedUsers))
    }
    const bug =useSelector((state)=>state.currentBug)
    const isThereACurrentBug=checkifCurrentBugIsFilled(bug)
    const currentUser =useSelector((state)=>state.currentUser)
    const hasComments=bugHasComments(bug)
    const clearCurrentBug=()=>{
        dispatch(removeSelectedBug())
    }
    useEffect(()=>{
    },[bug])
  return (
    <>
    {isThereACurrentBug?
    <Paper elevation={5}>
            <Box p={3}>
                <Typography variant='h4' gutterBottom>{bug.title}</Typography>
                <button onClick={clearCurrentBug}>Clear Bug</button>
                <button onClick={scrollToBottom}>Scroll Down</button>
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
                        onClick={sendComment}>
                            <SendIcon/>
                        </IconButton>
                     </Grid>
                </Grid>
            </Box>
        </Paper>:
        <h1>Selected Bug Info</h1>

    }
        
    </>
  )
}

export default BugComments