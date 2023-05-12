import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../../api/index";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch } from "react-redux";
import Comment from "../Comment/Comment";
import { setUsers } from "../../../redux/actions/userActions";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { InputAdornment } from "@mui/material";

const bugHasComments = (bug) => {
  if (bug.comments) {
    if (bug.comments.length > 0) {
      return true;
    }
  }
  return false;
};
const checkifCurrentBugIsFilled = (obj) => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return true;
  }
  return false;
};
const checkIfUserCanMakeComments = (user, bug) => {
  if (user) {
    if (bug) {
      if (user.role === "Admin") {
        return true;
      } else if (bug.assignedTo) {
        const userIDs = bug.assignedTo.map((user) => user._id);
        if (userIDs.includes(user._id)) {
          return true;
        }
      }
    }
  }
  return false;
};
const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div id="bottom" ref={elementRef} />;
};

const scrollToBottom = () => {
  const section = document.querySelector("#bottom");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const BugComments = ({ bug }) => {
  const [comments, setComments] = useState(bug.comments)
  const filteredComments = [...comments];
  filteredComments.filter((comment) => comment.creator == null);

  useEffect(() => {}, [bug]);

  const currentUser = useSelector((state) => state.currentUser);
  const isThereACurrentBug = checkifCurrentBugIsFilled(bug);
  const hasComments = bugHasComments(bug);
  const dispatch = useDispatch();
  const canUserMakeCommentsOnThisBug = checkIfUserCanMakeComments(
    currentUser,
    bug
  );
  const [chatInput, setChatInput] = useState({
    text: "",
    input: "",
  });
  const handleChange = (e) => {
    const inputFieldValue = e.target.value;
    const inputFieldName = e.target.id || e.target.name; //target name for the bugs select
    //if name is start or deadline change format to string
    const newInputValue = { ...chatInput, [inputFieldName]: inputFieldValue };
    setChatInput(newInputValue);
  };

  const sendComment = async (e) => {
    e.preventDefault();
    if (chatInput.text !== "") {
      const newComment = { ...chatInput };
      newComment.creator = currentUser._id;
      newComment.bugID = bug._id;
      //bug projectID property is a project object so get id
      newComment.projectID = bug.projectID;
      const commentTime = new Date(Date.now());
      //comment was uploading future time as in instead of 'a few seconds ago',
      //I would get in a few seconds so i subtracted some time
      newComment.date = commentTime.getTime() - 40000;
      const response = await api.comments.createComment(newComment);
      const updatedComments = [...comments, response]

      dispatch(setComments(updatedComments));
      setChatInput({
        text: "",
        input: "",
      });
      const updatedUsers = await api.users.fetchUsers();
      dispatch(setUsers(updatedUsers));
    }
  };

  useEffect(() => {}, [bug]);
  return (
    <>
      {isThereACurrentBug ? (
      
          <>
            <Button
              onClick={scrollToBottom}
              aria-label="Scroll to bottom of comments"
            >
              <ArrowDownwardIcon />
          </Button>
          
              <Grid item>
                <List>
                  {hasComments ? (
                    <>
                      <div>
                        {filteredComments.map((comment) => (
                          <div key={comment._id}>
                            <Comment comment={comment} />
                          </div>
                        ))}
                      </div>
                      <AlwaysScrollToBottom />
                    </>
                  ) : (
                    <></>
                  )}
                </List>
              </Grid>
              {canUserMakeCommentsOnThisBug ? (
                <>
                  <Box
                    component="form"
                    sx={{
                      display: "flex",
                    }}
                    onSubmit={sendComment}
                    autoComplete="off"
                  >
                    <FormControl
                      sx={{
                        width: "100%",
                        paddingRight: 1,
                      }}
                    >
                      <TextField
                        id="text"
                        value={chatInput.text}
                        label="Type your message"
                        variant="filled"
                        onChange={handleChange}
                        sx={{
                          flex: 1,
                        }}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {/* <IconButton>
                                <CancelIcon color="error" />
                              </IconButton> */}
                              <IconButton
                                aria-label="Submit new comment"
                                color="primary"
                                type="submit"
                              >
                                <SendIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Box>
                </>
              ) : (
                <></>
              )}
          </>
      ) : (
        <></>
      )}
    </>
  );
};

export default BugComments;
