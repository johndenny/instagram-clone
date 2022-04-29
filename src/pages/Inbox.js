import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inbox.css';

const Inbox = (props) => {
  const {
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
  
  const activityHandler = (directMessage) => {
    const {
      directMessageID
    } = directMessage;
    const messages = allMessages[directMessageID];
    console.log(messages);
    messages.sort((a, z) => {
      return a.date - z.date;
    });
    const lastMessage = messages[messages.length - 1];
    const date = formatTimeShort(lastMessage.date);
    console.log(messages);
    if (lastMessage.type === 'post') {
      if (lastMessage.uid === userData.uid) {
        return `You sent a post ∙ ${date}`;
      } else {
        return `${lastMessage.fullname} sent a post ∙ ${date}`;
      }
    } else if (lastMessage.type === 'heart') {
      return `❤️ ∙ ${date}`;
    } else if (lastMessage.type === 'text') {
      if (lastMessage.uid === userData.uid) {
        return `You sent a message ∙ ${date}`
      } else {
        return `${lastMessage.fullname} sent a message ∙ ${date}`
      }
    }
  }

  // useEffect(() => {
  //     getAllDirectMessages();
  // }, []);

  useEffect(() => {
    setIsInboxOpen(true);
    return () => setIsInboxOpen(false);
  });

  const onClickHandler = (user, directMessageID) => {
    if (isSuggestion) {
      suggestionSelection(user);
    } else {
      navigate(`/direct/t/${directMessageID}/`);
    }
  }

  return (
    <main className='direct-inbox'>
      <ul className='direct-inbox-messages'>
        {directMessages.map((directMessage) => {
          const {
            uid
          } = userData;
          const {
            profiles,
            directMessageID,
            title,
          } = directMessage;
          const profileIndex = profiles.findIndex((profile) => profile.uid !== uid);
          const {
            photoURL,
            fullname
          } = profiles[profileIndex];
          const fullnames = [];
          const UIDs = [];
          profiles.findIndex((profile) => {
            const {
              fullname,
              uid,
            } = profile;
            if (profile.uid !== userData.uid) {
              fullnames.push(fullname);
              UIDs.push(uid);
            };
          });
          let chatTitle;
          if (title === '') {
            chatTitle = fullnames.join(', ');
          } else {
            chatTitle = title;
          }
          let isSelected = null
          if (isSuggestion) {
            const selectedArray = recipientSelection.map((recipient) => {
              if (UIDs.length > 1) {
                const index = recipientSelection.findIndex((recipient) =>  recipient === profiles);
                if (index !== -1) {
                  return true;
                }
              } else {
                const recipientArray = [];
                recipient.forEach((user) => {
                  if (user.uid !== uid) {
                    recipientArray.push(user);
                  }
                });
                const userIndex = recipientArray.findIndex((user) => user.uid === UIDs[0]);
                if (recipientArray.length === 1) {
                  if (userIndex !== -1) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }                
              }
            })
            if (isSelected === null) {
              const booleanIndex = selectedArray.findIndex((boolean) => boolean === true);
              if (booleanIndex !== -1) {
                isSelected = true;
              } else {
                isSelected = false;
              }              
            }
          }
          let activity;
          if (!isSuggestion) {
            activity = activityHandler(directMessage);
          }
          return (
            <li 
              className='direct-message-card'
              key={directMessageID}
              onClick={() => onClickHandler(profiles, directMessageID)}
            >
              <div className='profile-photo-frame'>
                <img alt='' className='profile-photo' src={photoURL} />
              </div>
              <div className='direct-message-text'>
                <span className='direct-message-full-name'>
                  {chatTitle}
                </span>
                {!isSuggestion &&
                  <span className='direct-message-activity'>
                    {activity}
                  </span>                  
                }
              </div>
              {isSuggestion &&
                <div className='selected-checkmark'>
                  {isSelected 
                  ? <svg aria-label="Toggle selection" className="selected-checkmark-svg" color="#0095f6" fill="#0095f6" height="24" role="img" viewBox="0 0 24 24" width="24">
                      <path d="M12.001.504a11.5 11.5 0 1011.5 11.5 11.513 11.513 0 00-11.5-11.5zm5.706 9.21l-6.5 6.495a1 1 0 01-1.414-.001l-3.5-3.503a1 1 0 111.414-1.414l2.794 2.796L16.293 8.3a1 1 0 011.414 1.415z"></path>
                    </svg>
                  : <svg aria-label="Toggle selection" className="unselected-checkmark-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <circle cx="12.008" cy="12" fill="none" r="11.25" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"></circle>
                  </svg>
                }
                </div>              
              }
            </li>
          )
        })}
      </ul>
    </main>
  )
};

export default Inbox;