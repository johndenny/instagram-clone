import { useEffect } from 'react';
import './UnfollowModal.css';

const UnfollowModal = (props) => {
  const {
    followHandler,
    unfollowModalHandler,
    profileData,
    selectedListProfile,
  } = props;
  let username;
  let photoURL;
  let userProfile;
  if ( profileData.length === 0) {
    username = selectedListProfile.username;
    photoURL = selectedListProfile.photoURL;
    userProfile = selectedListProfile;
  } else {
    username = profileData.username;
    photoURL = profileData.photoURL;
    userProfile = profileData;
  }


  const stopBubbles = (event) => {
    event.stopPropagation();
  }

  useEffect(() => {
    console.log(profileData);
  }, []);

  return (
    <div className="profile-photo-modal" onClick={unfollowModalHandler}>
    <div className="post-links-content" onClick={stopBubbles}>
      <header className='unfollow-profile-content'>
        <div className='unfollow-profile-photo-frame'>
          <img alt={`${username}'s profile`} className='profile-photo' src={photoURL} />
        </div>
        <span className='unfollow-modal-text'>
          {`Unfollow @${username}?`}
        </span>
      </header>
      <div className="post-links-buttons">
        <button 
          className='unfollow-modal-button'
          onClick={() => followHandler(userProfile)}
        >
          Unfollow
        </button>
        <button className="cancel-button" onClick={unfollowModalHandler}>
          Cancel
        </button>
      </div>
    </div>
  </div>
  )
}

export default UnfollowModal