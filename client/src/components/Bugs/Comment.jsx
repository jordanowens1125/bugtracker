import React from "react";
import useAuthContext from "../../hooks/useAuthContext";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);
const Comment = ({ comment }) => {
  const { user } = useAuthContext();
  const isThisACurrentUserComment = comment.creator._id === user._id;
  // console.log(comment);
  return (
    <>
      <div className={isThisACurrentUserComment ? "message own" : "message"}>
        {/* <img className='messageImg' src={comment._id} alt='' /> */}
        <h5>{comment.creator.email}</h5>
        <div className="messageText">{comment.text}</div>
      </div>
    </>
  );
};

export default Comment;
