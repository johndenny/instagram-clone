import './NewMessage.css';
import React, { useState, useRef, useEffect, useLayoutEffect, Fragment } from 'react';
import PeopleList from '../components/PeopleList';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import firebaseApp from '../Firebase';
import Inbox from './Inbox';
import MessageSuggestedPeople from '../components/MessageSuggestedPeople';

const db = getFirestore();

const NewMessage = (props) => {
  const {
    groupUIDs,
    isAddPeople,
    isSharePostOpen,
    allMessages,
    sharePostText,
    sharePostTextHandler,
    sharePost,
    isModal,
    directMessages,
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
  const [suggestedUsers, setSuggestedUsers] = useState ([]);
  const [inputHeight, setInputHeight] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isModal) {
      setSuggestedUsers(directMessages);
    } else {
      const suggestions = [];
      directMessages.map((messsage) => {
        if (messsage.UIDs.length < 3) {
          suggestions.push(messsage);
        };
        return null
      });
      console.log(suggestions);
      setSuggestedUsers(suggestions);      
    }
  }, []);

  const onChangeHandler = (event) => {
    const height = inputRef.current.getBoundingClientRect().height;
    const { value } = event.target;
    setInputHeight(height);
    setSearchString(value);
  }

  const searchSelection = (user) => {
    const {
      username,
      fullname,
      uid,
      photoURL,
    } = userData;
    const selection = [
    {
      username: user.username,
      fullname: user.fullname,
      uid: user.uid,
      photoURL: user.photoURL
    },
    {
      username: username,
      fullname: fullname,
      uid: uid,
      photoURL: photoURL
    }, 
    ];
    const UIDs = [];
    let index;
    selection.forEach((user) => {
      if (user.uid !== userData.uid) {
        UIDs.push(user.uid);
      }
    });
    index = recipientSelection.findIndex((recipients) => {
      const recipientUIDs = [];
      recipients.forEach((user) => {
        if (user.uid !== userData.uid) {
          recipientUIDs.push(user.uid);
        }
      });
      console.log(UIDs, recipientUIDs)
      return JSON.stringify(recipientUIDs) === JSON.stringify(UIDs);
    })
    if (index === -1) {
      setRecipientSelection([...recipientSelection, selection]);
    } else {
      const newArray = [...recipientSelection];
      newArray.splice(index, 1);
      setRecipientSelection(newArray);
    }
    setSearchString('');
  }

  useEffect(() => {
    console.log(recipientSelection);
  }, [recipientSelection])

  const suggestionSelection = (users) => {
    console.log('users:', users, 'recipients:',recipientSelection);
    const UIDs = [];
    let index;
    users.forEach((user) => {
      if (user.uid !== userData.uid) {
        UIDs.push(user.uid);
      }
    });
    index = recipientSelection.findIndex((recipients) => {
      const recipientUIDs = [];
      recipients.forEach((user) => {
        if (user.uid !== userData.uid) {
          recipientUIDs.push(user.uid);
        }
      });
      console.log(UIDs, recipientUIDs)
      return JSON.stringify(recipientUIDs) === JSON.stringify(UIDs);
    })
    if (index === -1) {
      setRecipientSelection([...recipientSelection, users]);
    } else {
      const newArray = [...recipientSelection];
      newArray.splice(index, 1);
      setRecipientSelection(newArray);
    }
    setSearchString('');
  }

  const recipientSelectionHandler = (recipient) => {
    if (selectedRecipient === recipient) {
      setSelectedRecipient({username: null, uid: null});
    } else {
      setSelectedRecipient(recipient);
    }
  }

  const deleteRecipient = (recipient) => {
    const newSelection = [...recipientSelection]
    const recipientIndex = recipientSelection.findIndex((recipients) => recipients === recipient);
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
    return () => {
      setRecipientSelection([]);
    }
  }, []);

  return (
    <main className='new-message'>
      <section 
        className='new-message-form'
        ref={inputRef}
      >
        <h2 className='to-title-text'>
          To:
        </h2>
        <section className='selected-recipients'>
          {recipientSelection.map((recipient) => {
            let username = recipient.username;
            let chatTitle;            
            if (recipient.length !== undefined) {
              const fullnames = [];
              const photoURLS = [];
              recipient.findIndex((profile) => {
                const {
                  fullname,
                  photoURL,
                } = profile;
                if (profile.uid !== userData.uid) {
                  fullnames.push(fullname);
                  photoURLS.push(photoURL)
                };
              });
              if (fullnames.length === 2) {
                chatTitle = fullnames.join(' and ')
              } else if (fullnames.length > 2) {
                const overflow = fullnames.length - 2;
                const newFullnames = [...fullnames];
                newFullnames.splice(2, overflow, `and ${overflow} ${
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
            }
            const {
              uid
            } = recipient;
            return (
              <button 
                key={uid}
                className={selectedRecipient === recipient ? 'selected-recipient-button selected' : 'selected-recipient-button'}
                onClick={() => recipientSelectionHandler(recipient)}
              >
                <span className={selectedRecipient === recipient ? 'selected-recipient-username selected' : 'selected-recipient-username'}>
                  {chatTitle}
                </span>
                {selectedRecipient === recipient &&
                  <div 
                    className='selected-recipient-delete'
                    onClick={() => deleteRecipient(recipient)}
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
        <section 
          className='user-search-results'
          style={{
            top: `${inputHeight}px`
          }}
        >
          <PeopleList
            isAddPeople = {isAddPeople}
            groupUIDs = {groupUIDs}
            userData={userData}
            recipientSelection={recipientSelection}
            searchSelection={searchSelection}
            allUserProfiles={searchResults}
            isSearch={true}
            isMessage={true}
          />
        </section>      
      }
      <h2 className='suggested-header-text'>
        Suggested
      </h2>
      <ul className='suggested-people'>
        {suggestedUsers.map((directMessage) => {
          return (
            <Fragment key={directMessage.directMessageID}>
              <MessageSuggestedPeople
                isAddPeople={isAddPeople}
                groupUIDs={groupUIDs}
                isSharePostOpen={isSharePostOpen}
                directMessage={directMessage}
                allMessages={allMessages} 
                suggestionSelection={suggestionSelection}
                recipientSelection={recipientSelection}
                isSuggestion={true}
                userData={userData}
                directMessages={suggestedUsers}
                setIsInboxOpen={setIsInboxOpen}
                setSearchString={setSearchString}
                searchString={searchString}
                searchResults={searchResults}
              />               
            </Fragment>
          )   
        })}        
      </ul>
      {isModal &&
      <React.Fragment>
        <hr className='line-spacer'/>
          <footer className='mobile-share-modal-footer'>
            <div 
              className='mobile-share-input-wrapper'
              style={{
                height: `${recipientSelection.length === 0 ? 0 : 64}px`
              }}
            >
              {recipientSelection.length !== 0 &&
                <input 
                  className='mobile-share-text-input'
                  type='text'
                  placeholder='Write a message...'
                  autoComplete='off'
                  onChange={sharePostTextHandler}
                  value={sharePostText}
                />             
              }
            </div>
            <button
              onClick={sharePost} 
              className='send-share-button'
              disabled={recipientSelection.length === 0}
            >
              {recipientSelection.length > 1 ? 'Send Seperately' : 'Send'}
            </button>
          </footer>          
      </React.Fragment>
      }

    </main>
  )
}

export default NewMessage;