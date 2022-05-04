import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DirectMessageInboxCard from '../components/DirectMessageInboxCard';
import './Inbox.css';
import { getFirestore, collection, orderBy, limit, query, getDocs } from 'firebase/firestore';

const db = getFirestore();

const Inbox = (props) => {
  const {
    getLastMessage,
    getAllDirectMessages,
    lastMessages,
    allDirectMessageIDs,
    getAllMessages,
    formatTimeShort,
    allMessages,
    suggestionSelection,
    recipientSelection,
    isSuggestion,
    userData,
    directMessages,
    setIsInboxOpen,
  } = props;
  const navigate = useNavigate();
  const [allDirectMessages, setAllDirectMessages] = useState([]);

  useEffect(() => { 
    setIsInboxOpen(true);
    return () => setIsInboxOpen(false);
  }, []);


  return (
    <main className='direct-inbox'>
      {directMessages.length !== 0 &&
        <ul className='direct-inbox-messages'>
          {directMessages.map((directMessage) => {
            const {
              directMessageID
            } = directMessage;           
            return (
              <Fragment key={directMessageID}>
                <DirectMessageInboxCard
                  lastMessages={lastMessages}
                  formatTimeShort={formatTimeShort}
                  userData = {userData}
                  directMessage={directMessage}
                />              
              </Fragment>
            )
          })}
        </ul>      
      }
    </main>
  )
};

export default Inbox;