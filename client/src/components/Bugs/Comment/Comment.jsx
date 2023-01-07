import React from 'react'
import { useSelector } from 'react-redux'
import './Comment.css'
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs'
dayjs.extend(relativeTime);
const dateNow = dayjs()
const Comment = ({comment}) => {
    const currentUser= useSelector((state)=>state.currentUser)
    const isThisACurrentUserComment= comment.creator==currentUser._id
  return (
    <div className={isThisACurrentUserComment ? 'message own':'message'}>
        <div className='messageTop'>
            <img className='messageImg' src={comment._id} alt='' />
            <p className='messageText'>{comment.text}</p>
        </div>
        <div className="messageBottom">{dateNow.to(comment.date)}</div>
    </div>
  )
}

export default Comment