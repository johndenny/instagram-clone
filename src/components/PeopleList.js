import { useRef } from 'react';
import FollowButton from './FollowButton.js';
import './PeopleList.css'
import defaultProfile from '../images/default-profile-image.jpg';
import { Link, useNavigate } from 'react-router-dom';

const PeopleList = (props) => {
  const {
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
    if (isSearch) {
      saveRecentSearch(uid)
      setIsMouseHovering(false);
      navigate(`/${username}`);      
    }
  }

  
  if (userData && Object.keys(userData).length > 0 && Object.getPrototypeOf(userData) === Object.prototype) {
    console.log(allUserProfiles);
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
              {!isSearch &&
                <FollowButton
                  selectedListProfile={selectedListProfile}
                  userData={userData}
                  followHandler={followHandler}
                  unfollowModalHandler={unfollowModalHandler}
                  isFollowLoading={isFollowLoading}
                  user={user}
                />              
              }
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