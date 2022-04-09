import "./LikedByModal.css"
import LikedBy from "../pages/LikedBy"

const LikedByModal = (props) => {
  const {
    setIsLikedByModalOpen,
    unfollowModalHandler,
    followHandler,
    userData,
    selectedPost,
    isFollowLoading,
  } = props;

  const stopBubbles = (event) => {
    event.stopPropagation();
  }

  return (
    <div className="profile-photo-modal" onClick={() => setIsLikedByModalOpen(false)}>
      <div className="liked-by-content" onClick={stopBubbles}>
        <header className="liked-by-modal-header">
          <h1 className="liked-by-modal-header-text">
            Likes
          </h1>
          <button className="liked-by-modal-close-button" onClick={() => setIsLikedByModalOpen(false)}>
            <svg aria-label="Close" className="close-svg" color="#262626" fill="#262626" height="18" role="img" viewBox="0 0 24 24" width="18">
              <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
            </svg>
          </button>
        </header>
        <section className="liked-profiles-wrapper">
          <LikedBy 
            unfollowModalHandler={unfollowModalHandler}
            followHandler={followHandler}
            isFollowLoading={isFollowLoading}
            userData={userData} 
            selectedPost={selectedPost}
          />          
        </section>

      </div>
    </div>
  );
};

export default LikedByModal;