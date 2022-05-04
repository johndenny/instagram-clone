import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DirectMessage.css';
import { v4 as uuidv4 } from 'uuid';
import { getFirestore, setDoc, doc, onSnapshot, getDoc, collection, orderBy, where, updateDoc, query, arrayRemove, arrayUnion } from 'firebase/firestore';
import Message from '../components/Message';

const db = getFirestore();
let previousDate = null;
let lastPress = 0;

const DirectMessage = (props) => {
  const {
    messages,
    setMessages,
    setIsMessageLikesOpen,
    setSelectedMessageID,
    getLastMessage,
    getAllDirectMessages,
    setSelectedDirectMessageID,
    setSelectedMessage,
    setIsMessageLinksOpen,
    allMessages,
    setProfilePhotoTitle,
    setMessageTitle,
    userData,
    setIsInboxOpen,
    directMessages,
  } = props;
  const params = useParams();
  const [selectedMessages, setSelectedMessages] = useState(null);
  const [messageString, setMessageString] = useState('');
  const textareaRef = useRef(null);
  const messagesRef = useRef(null);
  const touchTimer = useRef(null);
  const [isGroup, setIsGroup] = useState(false);
  const tagTimerRef = useRef(null);
  // const [previousDate, setPreviousDate] = useState(null);

  const messageListener = () => {
    const {
      messageID
    } = params;
    const messagesQuery = query(collection(db, 'messages'), 
      where('directMessageID', '==', messageID),
      where('recipientUIDs', 'array-contains', userData.uid),
      orderBy('date'),
      );
    const messages = onSnapshot(messagesQuery, (querySnapShot) => {
      const messageArray = [];
      querySnapShot.forEach( async (docuemnt) => {
        const {
          notRead,
          messageID,
          directMessageID,
        } = docuemnt.data();
        messageArray.push(docuemnt.data());
        console.log(docuemnt.data());
        const notReadIndex = notRead.findIndex((read) => read === userData.uid);
        if (notReadIndex !== -1) {
          await updateDoc(doc(db, 'messages', messageID), {
            notRead: arrayRemove(userData.uid)
          });
          await updateDoc(doc(db, 'directMessages', directMessageID), {
            'lastMessage.notRead': arrayRemove(userData.uid)
          })          
        }
      });
      if (messageArray.length !== 0) {
        setMessages(messageArray);
        console.log(messageArray) 
      }
    });
  };

  useEffect(() => {
    setSelectedDirectMessageID(params.messageID);
    setIsInboxOpen(true);
    previousDate = null;
    return () => {
      setIsInboxOpen(false)
      setSelectedMessages(null);
      setMessageTitle('');
    }
  }, []);

  useLayoutEffect(() => {
    const {
      messageID
    } = params;
    const threadIndex = directMessages.findIndex((message) => message.directMessageID === messageID);
    setSelectedMessages(directMessages[threadIndex]);
    console.log(allMessages);
    // setMessages(allMessages[messageID].sort((a, z) => a.date - z.date));
    const {
      profiles,
      title,
      isGroup,
    } = directMessages[threadIndex];
    const {
      uid
    } = userData;
    const fullnames = [];
    const photoURLs = [];
    profiles.forEach((profile) => {
      const {
        fullname,
        photoURL
      } = profile;
      if (profile.uid !== uid) {
        fullnames.push(fullname);
        photoURLs.push(photoURL)
      };
    });
    if (photoURLs.length >= 1 && isGroup) {
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
    setMessageTitle(chatTitle)
    setProfilePhotoTitle(photoURLs);
    messageListener();
    setIsGroup(isGroup);
  }, [directMessages.UIDs]);

  const messageStringHandler = (event) => {
    const { value } = event.target;
    setMessageString(value);
  }

  // changes textarea size to scroll height

  useEffect(() => {
      textareaRef.current.style.height = '1px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;     
  }, [messageString]);

  useEffect(() => {
    console.log(selectedMessages)
  }, [selectedMessages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    setMessageString('');
    const {
      directMessageID,
      UIDs,
    } = selectedMessages;
    const {
      username,
      fullname,
      photoURL,
      uid,
    } = userData;
    const messageID = uuidv4();
    const message = {
      likes: [],
      recipientUIDs: UIDs,
      notRead: UIDs,
      messageID: messageID,
      directMessageID: directMessageID,
      username: username,
      fullname: fullname,
      photoURL: photoURL,
      uid: uid,
      type: 'text',
      text: messageString,
      date: Date.now(),
    }
    await updateDoc(doc(db, 'directMessages', directMessageID), {
      lastMessage: message,
      date: Date.now(),
    });
    await setDoc(doc(db, 'messages', messageID), message);
    await getLastMessage();
  }

  const sendHeart = async (event) => {
    event.preventDefault();
    const {
      directMessageID,
      UIDs,
    } = selectedMessages;
    const {
      username,
      fullname,
      photoURL,
      uid
    } = userData;
    const messageID = uuidv4();
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.type === 'heart' && lastMessage.uid === uid) {
      return null 
    } else {
      await updateDoc(doc(db, 'directMessages', directMessageID), {
        date: Date.now(),
      });
      await setDoc(doc(db, 'messages', messageID), {
        likes: [],
        recipientUIDs: UIDs,
        notRead: UIDs,
        messageID: messageID,
        directMessageID: directMessageID,
        username: username,
        fullname: fullname,
        photoURL: photoURL,
        uid: uid,
        type: 'heart',
        date: Date.now(),
      });
      await getLastMessage();
    };
  };

  const formatTime = (date) => {
    const timePast = date - previousDate;
    console.log(timePast, previousDate);
    if (timePast > 10800000 || timePast === null) {
      previousDate = date;
      const currentDate = new Date(Date.now());
      const postDate = new Date(date);
      const currentTime = postDate.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
      }).toLowerCase().split(' ').join('');
      const oneWeek = new Date();
      oneWeek.setDate(oneWeek.getDate() - 7);
      console.log(postDate, oneWeek);
      if (postDate > oneWeek) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (currentDate.toDateString() === postDate.toDateString()) {
          return currentTime;
        } else if (yesterday.toDateString() === postDate.toDateString()) {
          return `Yesterday ${currentTime}`
        } else {
          return `${postDate.toLocaleDateString([], {
            weekday: 'long',
          })} ${currentTime}`
        }
      } else {
        return `${postDate.toLocaleDateString([], {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })} ${currentTime}`
      }
    }
  }

  const touchStart = (message) => {
    setSelectedMessage(message);
    touchTimer.current = setTimeout(() => {
      setIsMessageLinksOpen(true);
    }, 1000);

    if (
      message.type === 'post' ||
      message.type === 'text' ||
      message.type === 'heart') {
        console.log(tagTimerRef.current);
        clearTimeout(tagTimerRef.current);
        const time = new Date().getTime();
        const delta = time - lastPress;

        const DOUBLE_PRESS_DELAY = 400;
        if (delta < DOUBLE_PRESS_DELAY) {
          console.log('double press');
          likeToggle(message);
        } else {
          console.log('press');
        }
        lastPress = time;        
      };
  };

  const likeToggle = async (message) => {
    const documentRef = doc(db, 'messages', message.messageID);
    const documentSnapShot = await getDoc(doc(db, 'messages', message.messageID));
    if (documentSnapShot.exists()) {
      const {
        likes
      } = documentSnapShot.data();
      console.log(likes);
      const index = likes.findIndex((like) => like.uid === userData.uid);
      if (index === -1) {
        const {
          fullname,
          username,
          uid,
          photoURL,
        } = userData;
        const likeID = uuidv4();
        await updateDoc(documentRef, {
          likes: arrayUnion({
            likeID: likeID,
            fullname: fullname,
            username: username,
            uid: uid,
            photoURL: photoURL,
            date: Date.now()
          })
        })
      } else {
        await updateDoc(documentRef, {
          likes: arrayRemove(likes[index])
        });
      };
    };
  };

  const touchEnd = () => {
    clearTimeout(touchTimer.current);
    touchTimer.current = null;
  }

  return (
    <main className='direct-message'>
      <div 
        className='messages-wrapper'
        ref={messagesRef}
      >
        <div className='messages-content'>
          {messages.map((message, index) => {
            if (index === 0) {
              console.log('index is zero!');
            }
            const className = ['message'];
            if (message.uid === userData.uid) {
              className.push('user');
            }
            if (
              message.type === 'post' ||
              message.type === 'text' ||
              message.type === 'heart') {
                if (message.likes.length !== 0) {
                  console.log(message.likes);
                  className.push('liked');
                };                
              } 
            return (
              <div 
                key={message.messageID}
                className={className.join(' ')}
                onTouchStart={() => touchStart(message)}
                onTouchEnd={touchEnd}
                onContextMenu={(event) => event.preventDefault()}
              >
                <Message
                  setSelectedMessageID = {setSelectedMessageID}
                  setIsMessageLikesOpen = {setIsMessageLikesOpen}
                  isGroup={isGroup}
                  index={index}
                  messages={messages}
                  formatTime={formatTime}
                  messagesRef={messagesRef}
                  userData={userData}
                  message={message}
                />
              </div>
            )
          })}
        </div>        
      </div>
      <form className='direct-message-inputs'>
        <div className='direct-message-inputs-wrapper'>
          <textarea
            placeholder='Message...'
            className='direct-message-input'
            type='text'
            onChange={messageStringHandler}
            value={messageString}
            ref={textareaRef}
          >
          </textarea>
          {messageString !== ''
            ? <button 
                className='send-message-button'
                onClick={sendMessage}
              >
                Send
              </button>
            : <React.Fragment>
                <button 
                  className='direct-message-add-photo-button'
                  type='button'
                >
                  <svg aria-label="Add Photo or Video" className="add-image-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <path d="M6.549 5.013A1.557 1.557 0 108.106 6.57a1.557 1.557 0 00-1.557-1.557z" fillRule="evenodd"></path>
                    <path d="M2 18.605l3.901-3.9a.908.908 0 011.284 0l2.807 2.806a.908.908 0 001.283 0l5.534-5.534a.908.908 0 011.283 0l3.905 3.905" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M18.44 2.004A3.56 3.56 0 0122 5.564h0v12.873a3.56 3.56 0 01-3.56 3.56H5.568a3.56 3.56 0 01-3.56-3.56V5.563a3.56 3.56 0 013.56-3.56z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>         
                <button 
                  className='direct-message-like-button'
                  type='button'
                  onClick={sendHeart}
                >
                  <svg aria-label="Like" className="message-like-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
                  </svg>
                </button>
              </React.Fragment>
          }
        </div>
      </form>
    </main>
  );
};

export default DirectMessage;