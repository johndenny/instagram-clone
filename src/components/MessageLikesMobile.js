import { arrayRemove } from 'firebase/firestore';
import { useLayoutEffect, useState } from 'react';
import './MessageLikesMobile.css';
import { getFirestore, updateDoc, doc, } from 'firebase/firestore';

const db = getFirestore();

const MessageLikesMobile = (props) => {
  const {
    userData,
    messages,
    selectedMessageID,
    setIsMessageLikesOpen,
  } = props;
  const [likes, setLikes] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  useLayoutEffect(() => {
    const index = messages.findIndex((message) => message.messageID === selectedMessageID);
    if (index !== -1) {
      const {
        likes
      } = messages[index];
      const userIndex = likes.findIndex((like) => like.uid === userData.uid);
      if (userIndex !== -1) {
        const newLikes = [...likes];
        newLikes.splice(userIndex, 1);
        setLikes([likes[userIndex], ...newLikes]);
      } else {
        setLikes(messages[index].likes);        
      };
    };
  }, [messages]);

  const closeModalHandler = () => {
    if (isClosing) {
      setIsMessageLikesOpen(false)
    }
  }

  const removeLike = async (like) => {
    setIsMessageLikesOpen(false);
    await updateDoc(doc(db, 'messages', selectedMessageID), {
      likes: arrayRemove(like),
    });
  };

  return (
    <main 
      className='message-likes-modal'
      onClick={() => setIsClosing(true)}
    >
      <div 
        className={
          isClosing 
            ? 'message-likes-content slide-down' 
            : 'message-likes-content'
        }
        onAnimationEnd={closeModalHandler}
        onClick = {(event) => event.stopPropagation()}
      >
        <div className='message-likes-spacer-header'>
          <div className='message-likes-grey-bar'></div>
        </div>
        <h1 className='message-likes-header-text'>
          Reactions
        </h1>
        <ul className='message-likes-list'>
          {likes.map((like) => {
            const {
              photoURL,
              username,
              uid,
              likeID,
            } = like;
            return (
              <li 
                className='reaction'
                key={likeID}
                onClick = {() => removeLike(like)}
              >
                <div className='profile-photo-frame'>
                  <img alt='' className='profile-photo' src={photoURL}/>
                </div>
                <div className='message-like-text'>
                  <span className='message-like-name'>
                    {username}
                  </span>
                  {uid === userData.uid &&
                    <span className='remove-text'>
                      Tap to Remove
                    </span>                  
                  }
                </div>
                <span className='reaction-symbol'>
                  ❤️
                </span>
              </li>
            )
          })}          
        </ul>

      </div>
    </main>
  );
};

export default MessageLikesMobile;