import React, { Fragment, useRef, useEffect, useLayoutEffect, useState } from 'react';
import './Message.css';
import MessagePost from './MessagePost';

let lastPress = 0;

const Message = (props) => {
  const {
    setIsMessageLikesOpen,
    setSelectedMessageID,
    isGroup,
    messages,
    index,
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
    newUsernames,
    removedUsername,
    type,
    likes,
  } = message;
  const [time, setTime] = useState(null);
  const [isPhotoHidden, setIsPhotoHidden] = useState(false);
  const [usernames, setUsernames] = useState([]);
  const [isNotification, setIsNotification] = useState(false);
  const [usernameTitle, setUsernameTitle] = useState('');

  useLayoutEffect(() => {
    console.log(messages[index].uid, uid);
    if (index === 0) {
      setUsernameTitle(username);
    } else if (messages[index - 1].uid !== uid) {
      setUsernameTitle(username);
    }
    if (message.type )
    if ((messages.length - 1) === index) {
      console.log('the-end')
      setIsPhotoHidden(false);
    } else {
      console.log(messages[index + 1]);
      if (
        messages[index + 1].type === 'group-add-people' || 
        messages[index + 1].type === 'remove-member' || 
        messages[index + 1].type === 'group-name-change' ||
        messages[index + 1].type === 'member-left'
      ) {
        return setIsPhotoHidden(false);
      }; 
      if (messages[index + 1].uid === uid) {
        setIsPhotoHidden(true);
      };      
    };
  }, [messages]);

  useEffect(() => {
    setTime(formatTime(date));
  }, [])

  useEffect(() => {
    if (message.type === 'group-add-people') {
      const newArray = [...message.newUsernames]
      newArray.splice(newUsernames.length - 1, 1);
      console.log(newArray)
      setUsernames(newArray);
    }
    if (
      message.type === 'group-add-people' ||
      message.type === 'remove-member' ||
      message.type === 'group-name-change' ||
      message.type === 'member-left'
    ) {
      setIsNotification(true);
      setUsernameTitle('');
    }
  }, [messages]);

  const likesModalHanlder = (id) => {
    setSelectedMessageID(id);
    setIsMessageLikesOpen(true);
  }

  return (
    <React.Fragment>
      {time !== undefined &&
        <time className='message-time-stamp'>
          {time}
        </time>           
      }

      {usernameTitle !== '' && uid !== userData.uid && isGroup &&
        <span className='message-username-title'>
          {usernameTitle}
        </span>
      }
      <div className={uid === userData.uid ? 'message-profile-photo-wrapper current-user' : 'message-profile-photo-wrapper'}>
        {!isNotification &&
          <div className={'message-profile-photo-spacer'}>
            {userData.uid !== uid && !isPhotoHidden &&
              <div className='profile-photo-frame'>
                <img alt='' className='profile-photo' src={photoURL} />
              </div>
            }  
          </div>         
        }
        {message.type === 'member-left' &&
          <div 
            key={messageID}
            className='message-content notification'
          >   
            <div className='group-name-change'>
              <span className='username'>
                {username}
              </span>
              <span> 
                left the group
              </span> 
            </div>
          </div>
        }
        {message.type === 'remove-member' &&
          <div 
            key={messageID}
            className='message-content notification'
          >   
            <div className='group-name-change'>
              <span className='username'>
                {username}
              </span>
              <span> 
                removed
              </span> 
              <span className='first-usernames'>
                {removedUsername}
              </span>
            </div>
          </div>
        }
        {message.type === 'group-add-people' &&
          <div 
            key={messageID}
            className='message-content notification'
          >   
            <div className='group-add-people'>
              <span className='username'>
                {username}
              </span>
              <span> 
                added
              </span>
              {newUsernames.length > 1 
                ? <span className='first-usernames'>
                    {usernames.join(', ')}
                  </span>
                : <span className='first-usernames'>
                    {newUsernames.join(', ')}
                  </span>
              }
              {newUsernames.length > 1 &&
                <Fragment>
                  <span>
                    and
                  </span>
                  <span className='last-usernames'>
                    {newUsernames[newUsernames.length - 1]}
                  </span>                  
                </Fragment>
              } 
            </div>
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
            {likes.length !== 0 && 
              <div 
                className='message-like'
                onClick = {() => likesModalHanlder(messageID)}
              >
                ❤️
                {likes.length === 2 &&
                  <Fragment>
                    <div className='profile-photo-frame'>
                      <img alt='' className='profile-photo' src={likes[0].photoURL} />
                    </div>
                    <div className='profile-photo-frame'>
                      <img alt='' className='profile-photo' src={likes[1].photoURL} />
                    </div>
                  </Fragment>
                }
                {likes.length === 1 && isGroup &&
                  <div className='profile-photo-frame'>
                    <img alt='' className='profile-photo' src={likes[0].photoURL} />
                  </div>
                }
              </div>
            }           
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
            {likes.length !== 0 && 
              <div 
                className='message-like'
                onClick = {() => likesModalHanlder(messageID)}
              >
                ❤️
                {likes.length === 2 &&
                  <Fragment>
                    <div className='profile-photo-frame'>
                      <img alt='' className='profile-photo' src={likes[0].photoURL} />
                    </div>
                    <div className='profile-photo-frame'>
                      <img alt='' className='profile-photo' src={likes[1].photoURL} />
                    </div>
                  </Fragment>
                }
                {likes.length === 1 && isGroup &&
                  <div className='profile-photo-frame'>
                    <img alt='' className='profile-photo' src={likes[0].photoURL} />
                  </div>
                }
              </div>
            } 
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
            {likes.length !== 0 && 
              <div 
                className='message-like'
                onClick = {() => likesModalHanlder(messageID)}
              >
                ❤️
                {likes.length === 2 &&
                  <Fragment>
                    <div className='profile-photo-frame'>
                      <img alt='' className='profile-photo' src={likes[0].photoURL} />
                    </div>
                    <div className='profile-photo-frame'>
                      <img alt='' className='profile-photo' src={likes[1].photoURL} />
                    </div>
                  </Fragment>
                }
                {likes.length === 1 && isGroup &&
                  <div className='profile-photo-frame'>
                    <img alt='' className='profile-photo' src={likes[0].photoURL} />
                  </div>
                }
              </div>
            }    
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