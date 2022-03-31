import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import './PostLinksModal.css'

const PostLinksModal = (props) => {
  const navigate = useNavigate();
  const {
    selectedPost,
    setIsPostLinkOpen,
    postLinksModalHandler
  } = props;


  const stopBubbles = (event) => {
    event.stopPropagation();
  }

  const navigationHandler = () => {
    navigate(`/p/${selectedPost[1].postID}`);
    setIsPostLinkOpen(false);
  }

  return (
    <div className="profile-photo-modal" onClick={postLinksModalHandler}>
      <div className="post-links-content" onClick={stopBubbles}>
        <div className="post-links-buttons">
          <button className='delete-post-button'>
            Delete
          </button>
          <button 
            className="go-to-post-button"
            onClick={navigationHandler}
          >
            Go to Post
          </button>
          <button className="cancel-button" onClick={postLinksModalHandler}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
};

export default PostLinksModal