import React, { useLayoutEffect, useState } from 'react';
import './Message.css';
import MessagePost from './MessagePost';

const Message = (props) => {
  const {
    formatTime,
    messageRef,
    userData,
    message
  } = props;
  const {
    messageID,
    text,
    uid,
    photoURL,
    date,
    username,
    title,
  } = message;
  const [time, setTime] = useState(null);

  useLayoutEffect(() => {
    setTime(formatTime(date));
  }, []);

  return (
    <React.Fragment>
      {time !== undefined &&
        <time className='message-time-stamp'>
          {time}
        </time>           
      }
      <div className='message-profile-photo-wrapper'>
        {userData.uid !== uid &&
          <div className='profile-photo-frame'>
            <img alt='' className='profile-photo' src={photoURL} />
          </div>
        }
        {message.type === 'group-name-change' &&
          <div 
            key={messageID}
            className='message-content notification'
          >   
            <div className='group-name-change'>
              <span className='username'>
                {username}
              </span>
              <span> named the group </span> 
              <span className='new-title'>
                {title}
              </span>
            </div>
          </div>
        }
        {message.type === 'post' &&
          <div 
            key={messageID}
            className='message-content'
          >            
            <MessagePost
              messageRef={messageRef}
              message={message}
            />
          </div>
        }
        {message.type === 'text' &&
          <div 
            key={messageID}
            className='message-content'
          >   
            <div className='message-content-text'>
              {text}
            </div>
          </div>
        }
        {message.type === 'heart' &&
          <div 
            key={messageID}
            className='message-content svg'
          >   
            <svg aria-label="Like" className="message-heart-svg" color="#ed4956" fill="#ed4956" height="44" role="img" viewBox="0 0 48 48" width="44">
              <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
            </svg>
          </div>
        }
      </div>        
    </React.Fragment>
  );
};

export default Message;