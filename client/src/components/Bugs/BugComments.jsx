import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../api/index";
import Comment from "./Comment";

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
  useEffect(() => {}, [bug]);

  const currentUser = useSelector((state) => state.currentUser);
  const userCanCommentsOnThisBug = checkIfUserCanMakeComments(currentUser, bug);

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
      newComment.date = commentTime.getTime();
      const response = await api.comments.createComment(newComment);
      //need to set creator so that info is correctly
      //displayed as owned by the current user
      response.creator = currentUser;
      const updatedComments = [...comments, response];
      setComments(updatedComments);
      setChatInput({
        text: "",
        input: "",
      });
    }
  };

  useEffect(() => {}, [bug]);
  return (
    <>
      {bug && (
        <>
          <span className="message-heading flex aic space-between">
            <p className="p-l-md">Comments:</p>
            <button onClick={scrollToBottom} className="button-secondary">
              Bottom
            </button>
          </span>
          {comments.length > 0 ? (
            <div className="p-lg h-lg comments">
              {comments.map((comment) => (
                <div key={comment._id}>
                  <Comment comment={comment} />
                </div>
              ))}
              <AlwaysScrollToBottom />
            </div>
          ) : (
            <>
              <div className="comments p-lg"> No Comments</div>
            </>
          )}
          {userCanCommentsOnThisBug && (
            <form className="message-input flex" onSubmit={sendComment}>
              <input
                type="text"
                value={chatInput.text}
                onChange={handleChange}
                placeholder="Enter comment.."
                className="full-height grow no-outline"
                id="text"
              />
              <button className="button-primary" type="submit">
                Submit
              </button>
            </form>
          )}
        </>
      )}
    </>
  );
};

export default BugComments;
