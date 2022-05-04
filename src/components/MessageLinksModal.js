import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import firebaseApp from '../Firebase';
import './MessageLinksModal.css';

const db = getFirestore();

const MessageLinksModal = (props) => {
  const {
    userData,
    selectedMessage,
    setIsMessageLinksOpen
  } = props;
  const {
    directMessageID,
    messageID,
    text,
    type,
    post,
  } = selectedMessage;

  const stopBubbles = (event) => {
    event.stopPropagation();
  }

  const unsendHandler = async () => {
    console.log(directMessageID, messageID);
    setIsMessageLinksOpen(false);
    await deleteDoc(doc(db, 'messages', messageID));
  }

  const copyHandler = () => {
    let copyText;
    if (type === 'text') {
      copyText = text;
    } else if (type === 'post') {
      copyText = `https://${window.location.host}/p/${post[0].postID}`
    }
    navigator.clipboard.writeText(copyText)
      .then(() => {
        console.log('copy sucessful');
      }, (err) => {
        console.log('error: copy unsucessful');
      })
    setIsMessageLinksOpen(false);
  }

  return (
    <div 
      className="profile-photo-modal" 
      onClick={() => setIsMessageLinksOpen(false)}
    >
        <div 
          className="post-links-content" 
          onClick={stopBubbles}
        >
          <div className="post-links-buttons">
            {selectedMessage.type !== 'heart' &&
              <button 
                className='copy-message-button'
                onClick={copyHandler}
              >
                Copy
              </button>            
            }
            {selectedMessage.uid === userData.uid &&
              <button 
                className="unsend-message-button"
                onClick={unsendHandler}
              >
                Unsend
              </button>                 
            }
            <button 
              className="cancel-button"
              onClick={() => setIsMessageLinksOpen(false)} 
            >
              Cancel
            </button>
          </div>
        </div>      
    </div>
  )
};

export default MessageLinksModal;