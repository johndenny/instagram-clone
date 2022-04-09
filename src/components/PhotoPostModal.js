import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobilePhotoPost from '../pages/MobilePhotoPost';
import './PhotoPostModal.css'

const PhotoPostModal = (props) => {
  const {
    selectedPost,
    setBackgroundLocation,
    setIsLikedByModalOpen,
    setSelectedPost,
    setDataLoading,
    getFollowingPosts,
    likeUploadToggle,
    userData,
    setIsLoadingPage,
    getPostData,
    postLinksModalHandler,
    isMobile,
    profileData,
    photosArray,
    setPhotosArray,
  } = props;
  const navigate = useNavigate();
  const isModal = true;

  useEffect(() => () => {
    console.log('unmount')
    setBackgroundLocation(null);
    setSelectedPost('');
  }, [])

  

  return (
    <div className='photo-post-modal'>
      <button 
        className='close-modal-button'
        onClick={() => navigate(-1)}
      >
        <svg aria-label="Close" className="close-upload-modal-svg" color="#ffffff" fill="#ffffff" height="24" role="img" viewBox="0 0 24 24" width="24">
          <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
          <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
        </svg>
      </button>
      <main className='photo-post-modal-content'>
        <MobilePhotoPost
          isModal={isModal}
          setBackgroundLocation={setBackgroundLocation}
          postLinksModalHandler={postLinksModalHandler}
          isMobile={isMobile}
          setIsLikedByModalOpen={setIsLikedByModalOpen}
          setSelectedPost={setSelectedPost}
          setDataLoading={setDataLoading}
          setPhotosArray={setPhotosArray}
          photosArray={photosArray}
          selectedPost={selectedPost}
          getFollowingPosts={getFollowingPosts}
          setIsLoadingPage={setIsLoadingPage}
          likeUploadToggle={likeUploadToggle}
          userData={userData}
        />
      </main>
    </div>
  );
};

export default PhotoPostModal;