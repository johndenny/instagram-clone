import './UnfollowModal.css';

const UnfollowModal = (props) => {
  const {
    followHandler,
    unfollowModalHandler,
    profileData,
    selectedListProfile,
  } = props;

  const stopBubbles = (event) => {
    event.stopPropagation();
  }

  return (
    <div className="profile-photo-modal" onClick={unfollowModalHandler}>
    <div className="post-links-content" onClick={stopBubbles}>
      <header className='unfollow-profile-content'>
        <div className='unfollow-profile-photo-frame'>
          <img alt={`${profileData.username}'s profile`} className='profile-photo' src={profileData.photoURL} />
        </div>
        <span className='unfollow-modal-text'>
          {`Unfollow @${profileData.username}?`}
        </span>
      </header>
      <div className="post-links-buttons">
        <button 
          className='unfollow-modal-button'
          onClick={() => followHandler(selectedListProfile)}
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