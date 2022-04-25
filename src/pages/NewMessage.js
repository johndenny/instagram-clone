import './NewMessage.css';
import { useState, useRef, useEffect } from 'react';
import PeopleList from '../components/PeopleList';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import firebaseApp from '../Firebase';

const db = getFirestore();

const NewMessage = (props) => {
  const {
    userData,
    setIsInboxOpen,
    setRecipientSelection,
    recipientSelection,
    setSearchString,
    searchString,
    searchResults
  } = props;
  const [selectedRecipient, setSelectedRecipient] = useState({username: null, uid: null});
  const newMessageSearchRef = useRef(null);

  const onChangeHandler = (event) => {
    const { value } = event.target;
    setSearchString(value);
  }

  const searchSelection = (user) => {
    const {
      username,
      uid,
      photoURL,
      fullname,
    } = user;
    const uidIndex = recipientSelection.findIndex((recipient) => recipient.uid === uid);
    if (uidIndex === -1) {
      setRecipientSelection([...recipientSelection, {
        username: username,
        uid: uid,
        photoURL: photoURL,
        fullname: fullname,
      }]);
      setSearchString('');      
    }
  }

  const recipientSelectionHandler = (username, uid) => {
    if (selectedRecipient.uid === uid) {
      setSelectedRecipient({username: null, uid: null});
    } else {
      setSelectedRecipient({
        username: username,
        uid: uid,
      })
    }
  }

  const deleteRecipient = (uid) => {
    const newSelection = [...recipientSelection]
    const recipientIndex = recipientSelection.findIndex((recipient) => recipient.uid === uid);
    if (recipientIndex !== -1) {
      newSelection.splice(recipientIndex, 1);
    }
    setRecipientSelection(newSelection);
  }

  useEffect(() => {
    console.log(recipientSelection);
  }, [recipientSelection]);

  useEffect(() => {
    newMessageSearchRef.current.focus();
    setIsInboxOpen(true);
  }, []);

  useEffect(() => () => {
    setRecipientSelection([]);
  },[]);

  return (
    <main className='new-message'>
      <section className='new-message-form'>
        <h2 className='to-title-text'>
          To:
        </h2>
        <section className='selected-recipients'>
          {recipientSelection.map((recipient) => {
            const {
              username,
              uid
            } = recipient;
            return (
              <button 
                key={uid}
                className={selectedRecipient.uid === uid ? 'selected-recipient-button selected' : 'selected-recipient-button'}
                onClick={() => recipientSelectionHandler(username, uid)}
              >
                <span className={selectedRecipient.uid === uid ? 'selected-recipient-username selected' : 'selected-recipient-username'}>
                  {username}
                </span>
                {selectedRecipient.uid === uid &&
                  <div 
                    className='selected-recipient-delete'
                    onClick={() => deleteRecipient(uid)}
                  >
                    <svg aria-label="Delete Item" className="delete-recipient-svg" color="#ffffff" fill="#ffffff" height="12" role="img" viewBox="0 0 24 24" width="12">
                      <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
                      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
                    </svg>
                  </div>                
                }
              </button>
            )
          })}
        </section>
        <input
          onFocus={() => setSelectedRecipient({username: null, uid: null})} 
          autoComplete='off'
          className='new-message-to-input'
          placeholder='Search...'
          spellCheck='false'
          type='text'
          onChange={onChangeHandler}
          value={searchString}
          ref={newMessageSearchRef}
        />
      </section>
      {searchString !== '' &&
        <section className='user-search-results'>
          <PeopleList
            recipientSelection={recipientSelection}
            searchSelection={searchSelection}
            allUserProfiles={searchResults}
            isSearch={true}
            isMessage={true}
          />
        </section>      
      }
      <section className='suggested-message-recipients'>

      </section>
    </main>
  )
}

export default NewMessage;