import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DirectMessageInboxCard.css";
import { getFirestore, collection, orderBy, limit, query, getDocs } from 'firebase/firestore';
import defaultProfileImage from "../images/default-profile-image.jpg";

const db = getFirestore();

const DirectMessageInboxCard = (props) => {
  const {
    lastMessages,
    userData,
    directMessage,
    formatTimeShort,
  } = props;
  const {
    profiles,
    title,
    directMessageID,
    lastMessage,
    isGroup,    
  } = directMessage;
  const [chatTitle, setChatTitle] = useState('');
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);
  const [isNotRead, setIsNotRead] = useState(false);
  const [photoURLs, setPhotoURLs] = useState('');
  const navigate = useNavigate();

  const activityHandler = () => {
    let message;
    let timeStamp;
    console.log(lastMessage);
    const index = lastMessage.recipientUIDs.findIndex((recipient) => recipient === userData.uid)
    if (index !== -1) {
      const {
        notRead,
        date,
        type,
        fullname,
        username,
        text,
        newUsernames,
        removedUsername,
        uid
      } = lastMessage
      const notReadIndex = notRead.findIndex((uid) => uid === userData.uid);
      if (notReadIndex !== -1) {
        setIsNotRead(true);
      }
      timeStamp = formatTimeShort(date);
      setDate(timeStamp);
      console.log(message);
      if (type === 'post') {
        if (uid === userData.uid) {
          return `You sent a post`;
        } else {
          return `${fullname} sent a post`;
        }
      } else if (type === 'heart') {
        return `❤️`;
      } else if (type === 'text') {
        if (profiles.length > 2) {
          if (uid === userData.uid) {
            return `You: ${text}`
          } else {
            return `${username}: ${text}`
          }
        } else {
          return `${text}`
        };
      } else if (type === 'photo') {
          if (uid === userData.uid) {
            return `You sent a photo`
          } else {
            return `${username} sent a photo`
        }
      } else if (type === 'group-name-change') {
        return `${username} named the group ${title}`;
      } else if (type === 'group-add-people') {
        return `${username} added ${newUsernames.join(', ')}`;
      } else if (type === 'remove-member') {
        return `${username} removed ${removedUsername}`;
      } else if (type === 'member-left') {
        return `${username} left the group`;
      };
    } else {
      setIsEmpty(true);
    };
  };


  useLayoutEffect(() => {
    const fullnames = [];
    const photoURLs = [];
    profiles.forEach((profile, index) => {
      const {
        fullname,
        uid,
        photoURL,
      } = profile;
      if (uid !== userData.uid) {
        fullnames.push(fullname);
        if (photoURL === '') {
          photoURLs.push(defaultProfileImage);
        } else {
          photoURLs.push(photoURL);
        }
      };
    });
    if (photoURLs.length >= 1 && directMessage.isGroup) {
      const index = profiles.findIndex((profile) => profile.uid === userData.uid);
      photoURLs.push(profiles[index].photoURL);
    };
    let chatTitle;
    if (title === '') {
      if (fullnames.length === 2) {
        chatTitle = fullnames.join(' and ')
      } else if (fullnames.length === 3) {
        fullnames.splice(2, 1, `and ${fullnames[2]}`);
        chatTitle = fullnames.join(', ')
      } else if (fullnames.length > 3) {
        const overflow = fullnames.length - 3;
        const newFullnames = [...fullnames]
        newFullnames.splice(3, overflow, `and ${overflow} ${
          overflow === 1 
            ? 'other' 
            : 'others'
        }`);
        chatTitle = newFullnames.join(', ');
      } else if (fullnames.length === 0) {
        chatTitle = 'Just You'
      } else {
        chatTitle = fullnames.join(', ');
      };
    } else {
      chatTitle = title;
    };
    setChatTitle(chatTitle);
    setPhotoURLs(photoURLs);
  },[directMessage]);

  useEffect(() => {
    setActivity(activityHandler);
  },[lastMessages]);

  if (isEmpty) {
    return null;
  } else {
    return (
      <li 
        className='direct-message-card'
        onClick={() => navigate(`/direct/t/${directMessageID}/`)}
      >
        {photoURLs.length > 1 &&
          <div className="group-profile-photo-frame">
            <div className='double-profile-photo-frame'>
              <img alt='' className='profile-photo' src={photoURLs[0]} />
            </div>
            <div className="profile-photo-border">
              <div className='double-profile-photo-frame bottom'>
                <img alt='' className='profile-photo' src={photoURLs[1]} />
              </div>             
            </div>          
          </div>
        }
        {photoURLs.length === 1 &&
          <div className='profile-photo-frame'>
            <img alt='' className='profile-photo' src={photoURLs[0]} />
          </div>        
        }
        <div className='direct-message-text'>
          <span className={isNotRead ? 'direct-message-full-name bold' : 'direct-message-full-name'}>
            {chatTitle}
          </span>
          <div className="activity-time-wrapper">
            <span className={isNotRead ? 'direct-message-activity bold' : 'direct-message-activity'}>
              {activity}&nbsp;
            </span>
            <time className="direct-message-time">
              {` ∙ ${date}`}
            </time>            
          </div>
        </div>
        {isNotRead &&
          <div className="not-read-dot">
          </div>
        }
      </li>
    )    
  };
};

export default DirectMessageInboxCard;