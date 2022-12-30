import React from 'react'
import { useSelector } from 'react-redux'
import './Comment.css'

const Comment = ({comment}) => {
    const currentUser= useSelector((state)=>state.currentUser)
    const isThisACurrentUserComment= comment.creator==currentUser._id
    //console.log(isThisACurrentUserComment)
  return (
    <div className={false ? 'message own':'message'}>
        <div className='messageTop'>
            <img className='messageImg' src='' alt={comment.creator} />
            <p className='messageText'>{comment.text}</p>
        </div>
        <div className="messageBottom">1 hour ago</div>
    </div>
  )
}

export default Comment