import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../../api/index";
import Comment from "../Comment/Comment";

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
  const [comments, setComments] = useState(bug.comments);
  const filteredComments = [...comments];
  filteredComments.filter((comment) => comment.creator == null);

  useEffect(() => {}, [bug]);

  const currentUser = useSelector((state) => state.currentUser);
  const isThereACurrentBug = checkifCurrentBugIsFilled(bug);
  const hasComments = bugHasComments(bug);
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
      const updatedComments = [...comments, response];
      setComments(updatedComments);
      setChatInput({
        text: "",
        input: "",
      });
      // dispatch(setUsers(updatedUsers));
    }
  };

  useEffect(() => {}, [bug]);
  return (
    <>
      {isThereACurrentBug && (
        <>
          <span className="message-heading flex aic space-between">
            <p className="p-l-md">Comments:</p>
            <button onClick={scrollToBottom} className="button-secondary">
              Bottom
            </button>
          </span>
          {hasComments ? (
            <div className="p-lg h-lg">
              {filteredComments.map((comment) => (
                <div key={comment._id}>
                  <Comment comment={comment} />
                </div>
              ))}
              <AlwaysScrollToBottom />
            </div>
          ) : (
            <></>
          )}
          {canUserMakeCommentsOnThisBug && (
            <span className="message-input flex space-between">
              <input
                type="text"
                value={chatInput.text}
                onChange={handleChange}
                placeholder="Enter comment.."
                className="full-height border"
                id="text"
              />
              <button onClick={sendComment} className="button-primary">
                Submit
              </button>
            </span>
          )}
        </>
      )}
    </>
  );
};

export default BugComments;
