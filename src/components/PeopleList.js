import { useRef } from 'react';
import FollowButton from './FollowButton.js';
import './PeopleList.css'
import defaultProfile from '../images/default-profile-image.jpg';
import { Link, useNavigate } from 'react-router-dom';

const PeopleList = (props) => {
  const {
    recipientSelection,
    isMessage,
    isComment,
    searchSelection,
    isTag,
    tagUserSelection,
    isRecentSearch,
    deleteRecentSearch,
    isSearch,
    saveRecentSearch,
    setIsMouseHovering,
    onMouseEnter,
    onMouseLeave,
    selectedListProfile,
    allUserProfiles,
    userData,
    followHandler,
    isFollowLoading,
    unfollowModalHandler,
  } = props;
  const navigate = useNavigate();
  const usernameRef = useRef([]);
  const photoRef = useRef([]);

  const navigateUserProfile = (username, uid) => {
    if (isTag) {
      tagUserSelection(username, uid);
      return;
    } else if (isSearch) {
      saveRecentSearch(uid)
      setIsMouseHovering(false);
      navigate(`/${username}`);      
    }
  }

  const onClickHandler = (user) => {
    const {
      username,
      uid,
    } = user;
    if (isMessage) {
      return searchSelection(user);
    }
    if (isComment) {
      searchSelection(username);
    } else {
      navigateUserProfile(username, uid);
    }
    
  }

  if (isSearch || isMessage) {
    return (
      <ul className='people-list'>
        {allUserProfiles.map((user, index) => {
          const {
            username,
            photoURL,
            fullname,
            fullName,
            uid,
          } = user;
          let selectedIndex;
          let isSelected;
          if (isMessage) {
            isSelected = recipientSelection.map((recipient) => {
              const recipientArray = [];
              recipient.forEach((user) => {
                if (user.uid !== userData.uid) {
                  recipientArray.push(user);
                }
              });
              const userIndex = recipientArray.findIndex((user) => user.uid === uid);
              console.log(recipientArray[0].uid === uid);
              if (recipientArray.length === 1) {
                if (userIndex !== -1) {
                  console.log('TRUE');
                  return true;
                } else {
                  console.log('FALSE');
                  return false;
                }
              } else {
                console.log('FALSE');
                return false;
              }
            })
            const booleanIndex = isSelected.findIndex((boolean) => boolean === true);
            if (booleanIndex !== -1) {
              isSelected = true;
            } else {
              isSelected = false;
            }
          }
          console.log(isSelected, index);
          return (
            <li 
              key={uid}
              className='user-wrapper'
              onClick={() => onClickHandler(user)} 
              onMouseDown={(event) => event.preventDefault()}
            >
              <div
                to={`/${username}`}
                className='profile-photo-frame'
                ref={(element) => photoRef.current.push(element)}
                onMouseEnter={() => onMouseEnter(uid, photoRef.current[index])}
                onMouseLeave={onMouseLeave}
              >
                <img alt={`${username}'s profile`} className='user-profile-photo' src={photoURL === '' ? defaultProfile : photoURL} />
              </div>
              <div className='user-text-wrapper'>
                <span 
                  to={`/${username}`}
                  className='username-text'
                  ref={(element) => usernameRef.current.push(element)}
                  onMouseEnter={() => onMouseEnter(uid, usernameRef.current[index])}
                  onMouseLeave={onMouseLeave} 
                >
                  {username}
                </span>
                <span className='full-name-text'>
                  {fullname || fullName}
                </span>
              </div>
              {isRecentSearch &&
                <button 
                  className='delete-recent-search'
                  onClick={(event) => deleteRecentSearch(event, uid)}
                >
                  <svg aria-label="Close" className="close-search-svg" color="#8e8e8e" fill="#8e8e8e" height="16" role="img" viewBox="0 0 24 24" width="16">
                    <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
                  </svg>
                </button>
              }
              {isMessage && 
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
    )
  } else if (userData && Object.keys(userData).length > 0 && Object.getPrototypeOf(userData) === Object.prototype) {
    return (
      <ul className='people-list'>
        {allUserProfiles.map((user, index) => {
          const {
            username,
            photoURL,
            fullname,
            fullName,
            uid,
          } = user;
          return (
            <li 
              key={uid}
              className='user-wrapper'
              onClick={() => navigateUserProfile(username, uid)} 
            >
              <div
                to={`/${username}`}
                className='profile-photo-frame'
                ref={(element) => photoRef.current.push(element)}
                onMouseEnter={() => onMouseEnter(uid, photoRef.current[index])}
                onMouseLeave={onMouseLeave}
              >
                <img alt={`${username}'s profile`} className='user-profile-photo' src={photoURL === '' ? defaultProfile : photoURL} />
              </div>
              <div className='user-text-wrapper'>
                <span 
                  to={`/${username}`}
                  className='username-text'
                  ref={(element) => usernameRef.current.push(element)}
                  onMouseEnter={() => onMouseEnter(uid, usernameRef.current[index])}
                  onMouseLeave={onMouseLeave} 
                >
                  {username}
                </span>
                <span className='full-name-text'>
                  {fullname || fullName}
                </span>
              </div>
              <FollowButton
                selectedListProfile={selectedListProfile}
                userData={userData}
                followHandler={followHandler}
                unfollowModalHandler={unfollowModalHandler}
                isFollowLoading={isFollowLoading}
                user={user}
              />              
            </li>
          )
        })}
      </ul>
    );  
  } else {
    return null;
  }
  
};

export default PeopleList;