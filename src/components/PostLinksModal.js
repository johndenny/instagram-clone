import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import './PostLinksModal.css'

const PostLinksModal = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const {
    setSelectedPost,
    selectedPost,
    setIsPostLinksOpen,
  } = props;


  const stopBubbles = (event) => {
    event.stopPropagation();
  }

  useEffect(() => {
    console.log(selectedPost);
  }, [selectedPost]);

  const navigationHandler = () => {
    console.log(selectedPost[1]);
    navigate(`/p/${selectedPost[1].postID}`);
    setIsPostLinksOpen(false);
  }

  const closeModal = () => {
    if (params.postID !== undefined) {
      setSelectedPost('')
    }
    setIsPostLinksOpen(false);
  }

  return (
    <div className="profile-photo-modal" onClick={closeModal}>
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
          <button className="cancel-button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
};

export default PostLinksModal