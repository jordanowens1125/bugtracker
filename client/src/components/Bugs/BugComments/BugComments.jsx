import React, { useMemo,useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../../api/index'
import {Typography, Container, Paper,Box, Divider, Grid, List, ListItem, ListItemText, FormControl, TextField, IconButton} from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from 'react-redux'
import { removeSelectedBug} from '../../../redux/actions/bugActions'

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

const BugComments = () => {
    const [chatMessages, setChatMessages]=useState([])
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
        const comments = await api.comments.fetchBugComments(bugID)
        setChatMessages(comments)
        setChatInput({
            text:'',
            input:'',
        })
    }
    const bug =useSelector((state)=>state.currentBug)
    const isThereACurrentBug=checkifCurrentBugIsFilled(bug)
    const currentUser =useSelector((state)=>state.currentUser)
    const hasComments=bugHasComments(bug)
    const clearCurrentBug=()=>{
        console.log('hi')
        dispatch(removeSelectedBug())
    }
    useMemo(()=>{
    },[bug])
  return (
    <>
    {isThereACurrentBug?
    <Paper elevation={5}>
            <Box p={3}>
                <Typography variant='h4' gutterBottom>{bug.title}</Typography>
                <button onClick={clearCurrentBug}>Clear Bug</button>
                <Divider/>
                <Grid>
                     <Grid item>
                        <List>
                            {hasComments?
                                <div>{bug.comments.map((comment)=>(
                                    <div key={comment._id}>{comment.text}</div>
                                ))}</div>
                                :<div>no comments</div>
                            }
                        </List>
                     </Grid>
                     <Grid item>
                        <FormControl fullWidth>
                            <TextField value={'Jordan'}
                            variant='outlined'/>
                        </FormControl>
                     </Grid>
                     <Grid xs={9} item>
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
                     <Grid item>
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