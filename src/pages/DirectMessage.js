import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DirectMessage.css';
import { v4 as uuidv4 } from 'uuid';
import { getFirestore, setDoc, doc, onSnapshot, collection } from 'firebase/firestore';
import Message from '../components/Message';

const db = getFirestore();

const DirectMessage = (props) => {
  const {
    allMessages,
    setProfilePhotoTitle,
    setMessageTitle,
    userData,
    setIsInboxOpen,
    directMessages,
  } = props;
  const params = useParams();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageString, setMessageString] = useState('');
  const textareaRef = useRef(null);
  const messagesRef = useRef(null);

  const messageListener = () => {
    const {
      messageID
    } = params;
    onSnapshot(collection(db, messageID), (collection) => {
      const messageArray = [];
      collection.forEach((docuemnt) => {
        messageArray.push(docuemnt.data());
      });
      messageArray.sort((a, z) => {
        return a.date - z.date;
      })
      setMessages(messageArray);
      console.log(messageArray)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    });
  };

  useLayoutEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, []);

  useEffect(() => {
    setIsInboxOpen(true);
    const {
      messageID
    } = params;
    const threadIndex = directMessages.findIndex((message) => message.directMessageID === messageID);
    setSelectedMessage(directMessages[threadIndex]);
    setMessages(allMessages[messageID].sort((a, z) => a.date - z.date));
    const {
      profiles
    } = directMessages[threadIndex];
    const {
      uid
    } = userData;
    const title = [];
    const photoURLS = [];
    profiles.findIndex((profile) => {
      const {
        fullname,
        photoURL
      } = profile;
      if (profile.uid !== uid) {
        title.push(fullname);
        photoURLS.push(photoURL)
      };
    });
    setMessageTitle(title.join(', '))
    setProfilePhotoTitle(photoURLS[0]);
    messageListener();
    return () => {
      setSelectedMessage(null);
      setMessageTitle('');
    }
  }, []);

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
    console.log(selectedMessage)
  }, [selectedMessage]);

  const sendMessage = async (event) => {
    event.preventDefault();
    setMessageString('');
    const {
      directMessageID,
    } = selectedMessage;
    const {
      username,
      fullname,
      photoURL,
      uid,
    } = userData;
    const messageID = uuidv4();
    await setDoc(doc(db, directMessageID, messageID), {
      messageID: messageID,
      directMessageID: directMessageID,
      username: username,
      fullname: fullname,
      photoURL: photoURL,
      uid: uid,
      text: messageString,
      date: Date.now(),
    });
    
  }

  return (
    <main className='direct-message'>
      <div 
        className='messages-wrapper'
        ref={messagesRef}
      >
        <div className='messages-content'>
          {messages.map((message) => {
            return (
              <div 
                key={message.messageID}
                className={message.uid === userData.uid ? 'message user' : 'message'}
              >
                <Message
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
                  className='direct-message-like-button'
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