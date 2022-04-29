import './MobileShareModal.css';
import NewMessage from '../pages/NewMessage';
import { useEffect, useState } from 'react';
import { getFirestore, collection, where, query, getDocs, setDoc, doc } from 'firebase/firestore';
import firebaseApp from '../Firebase';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore();

const MobileShareModal = (props) => {
  const {
    showNotification,
    postToSend,
    directMessages,
    setIsSharePostOpen,
    setIsInboxOpen,
    userData,
    recipientSelection,
    setRecipientSelection,
    setSearchString,
    searchString,
    searchResults,
  } = props;
  const [sharePostText, setSharePostText] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflowY = 'scroll';
    }
  }, []);

  useEffect(() => {
    console.log(postToSend);
  }, [])

  const sharePostTextHandler = (event) => {
    const {
      value
    } = event.target;
    setSharePostText(value);
  }

  const sharePost = async () => {
    setIsSharePostOpen(false);
    const {
      username,
      fullname,
      photoURL,
      uid,
    } = userData;
    console.log(recipientSelection);
    for (let i = 0; i < recipientSelection.length; i++) {
      const UIDs = [];
      recipientSelection[i].forEach((recipient) => {
        UIDs.push(recipient.uid);
      });
      const copyCheck = query(collection(db, 'directMessages'), 
        where('UIDs', '==', UIDs));
      const copyCheckSnap = await getDocs(copyCheck);
      const docs = [];
      copyCheckSnap.forEach((doc) => {
        docs.push(doc.data());
      })
      console.log(docs);
      let directMessageID;
      console.log(docs.length);
      if (docs.length === 1) {
        directMessageID = docs[0].directMessageID;
      } else {
        directMessageID = uuidv4();
        const UIDs = [uid];
        const profiles = [{
          fullname: fullname,
          photoURL: photoURL,
          uid: uid,
          username: username,
          isAdmin: true,
        }];
        recipientSelection[i].forEach((recipient) => {
          if (recipient.uid !== uid) {
            UIDs.push(recipient.uid);
            profiles.push({...recipient, isAdmin: false});
          };
        });        
        await setDoc(doc(db, 'directMessages', directMessageID), {
          directMessageID: directMessageID,
          UIDs: UIDs,
          profiles: profiles,
          title: ''
        });
      };
      const firstID = uuidv4();
      await setDoc(doc(db, directMessageID, firstID), {
        messageID: firstID,
        directMessageID: directMessageID,
        username: username,
        fullname: fullname,
        photoURL: photoURL,
        uid: uid,
        type: 'post',
        post: postToSend,
        date: Date.now(),
      });
      if (sharePostText !== '') {
        const secondID = uuidv4();
        await setDoc(doc(db, directMessageID, secondID), {
          messageID: secondID,
          directMessageID: directMessageID,
          username: username,
          fullname: fullname,
          photoURL: photoURL,
          uid: uid,
          type: 'text',
          text: sharePostText,
          date: Date.now(),
        });        
      }
    };
    showNotification('Sent')
  };

  return (
    <main className='mobile-share-modal'>
      <header className='mobile-share-modal-header'>
        <div className='mobile-share-spacer'>
        </div>
        <h1 className='mobile-share-header-text'>
          Share
        </h1>
        <button 
          className='close-share-modal'
          onClick={() => setIsSharePostOpen(false)}
        >
          <svg aria-label="Close" className="close-share-modal-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="3" y2="21"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="21" y2="3"></line>
          </svg>
        </button>
      </header>
      <NewMessage
        sharePostText = {sharePostText}
        sharePostTextHandler = {sharePostTextHandler}
        isModal={true}
        sharePost={sharePost}
        directMessages={directMessages}
        setIsInboxOpen={setIsInboxOpen}
        userData={userData}
        recipientSelection={recipientSelection}
        setRecipientSelection={setRecipientSelection}
        setSearchString={setSearchString}
        searchString = {searchString}
        searchResults = {searchResults}
      />
    </main>
  );
};

export default MobileShareModal;