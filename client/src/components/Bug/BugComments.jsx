import React, { useState, useRef, useEffect } from "react";
import api from "../../api/index";
import Comment from "../Bugs/Comment";
import useAuthContext from "../../hooks/useAuthContext";
import Buttons from "../Shared/Buttons";

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

  const { user } = useAuthContext();

  const userCanCommentsOnThisBug =
    (bug.assignedTo && bug.assignedTo._id === user._id) ||
    user.role === "Admin" ||
    user.role === "Project Manager";

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
      newComment.creator = user._id;
      newComment.bugID = bug._id;
      //bug projectID property is a project object so get id
      newComment.projectID = bug.projectID;
      const commentTime = new Date(Date.now());
      newComment.date = commentTime.getTime();
      try {
        const response = await api.comments.createComment(user, newComment);
        //need to set creator so that info is correctly
        //displayed as owned by the current user
        response.creator = user;
        const updatedComments = [...comments, response];
        setComments(updatedComments);
        setChatInput({
          text: "",
          input: "",
        });
      } catch (error) {}
    }
  };

  useEffect(() => {}, [bug]);
  return (
    <>
      {bug && (
        <>
          <span className="message-heading flex aic space-between mobile-column">
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
              <Buttons submit={"Submit"} />
            </form>
          )}
        </>
      )}
    </>
  );
};

export default BugComments;
