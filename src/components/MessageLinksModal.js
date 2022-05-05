import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import firebaseApp from '../Firebase';
import './MessageLinksModal.css';

const db = getFirestore();
const storage = getStorage();

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
    photoURLs,
  } = selectedMessage;

  const stopBubbles = (event) => {
    event.stopPropagation();
  }

  const unsendHandler = async () => {
    if (type === 'photo') {
      const {
        photoID
      } = photoURLs;
      console.log(photoID);
      const w640Ref = ref(storage, `w640_photoUploads/${photoID}.jpg`);
      const w480Ref = ref(storage, `w480_photoUploads/${photoID}.jpg`);
      const w320Ref = ref(storage, `w320_photoUploads/${photoID}.jpg`);
      const w240Ref = ref(storage, `w240_photoUploads/${photoID}.jpg`);
      const w150Ref = ref(storage, `w150_photoUploads/${photoID}.jpg`);
      try {
        await deleteObject(w640Ref);
        await deleteObject(w480Ref);
        await deleteObject(w320Ref);
        await deleteObject(w240Ref);
        await deleteObject(w150Ref);
      } catch (error) {
        console.log(error);
      }
    }
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