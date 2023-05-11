import React from "react";
import { useSelector } from "react-redux";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);
const Comment = ({ comment }) => {
  const currentUser = useSelector((state) => state.currentUser);
  const isThisACurrentUserComment = comment.creator._id === currentUser._id;
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
