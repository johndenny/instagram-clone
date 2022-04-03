import './MobilePhotoPost.css'
import firebaseApp from '../Firebase';
import { getFirestore, query, collection, where, orderBy, getDocs, doc, getDoc} from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore()
let lastPress = 0;

const MobilePhotoPost = (props) => {
  const {
    setIsLoadingPage,
    likeUploadToggle,
    setDataLoading, 
    selectedPost,
    setSelectedPost,
    userData, 
  } = props;
  const [width, height] = useWindowSize();
  const params = useParams();
  const navigate = useNavigate();
  const [postHidden, setPostHidden] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [movementStart, setMovementStart] = useState(0);
  const [movement, setMovement] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isButtonLiked, setIsButtonLiked] = useState(false);

  const onDoublePress = (event) => {
    const time = new Date().getTime();
    const delta = time - lastPress;

    const DOUBLE_PRESS_DELAY = 400;
    if (delta < DOUBLE_PRESS_DELAY) {
        console.log('double press');
        setIsLiked(true);
        const alreadyLiked = selectedPost[0].likes.findIndex((like) => like.uid === userData.uid);
        if (alreadyLiked === -1) {
        likeHandler();
        }
    } else {
      movementStartHandler(event);
    }
    lastPress = time;
  };

  const likeHandler = async () => {
    
    const {
      photoURL,
      uid,
      displayName,
      fullname
    } = userData;
    const { postID } = selectedPost[0];   
    const alreadyLiked = selectedPost[0].likes.findIndex((like) => like.uid === uid);
    if (alreadyLiked === -1) {
      setIsButtonLiked(true);
      const newLikes = [...selectedPost[0].likes];
      const newPost = {...selectedPost[0], likes: newLikes};
      const newArray = [...selectedPost]
      newLikes.push({
        likeID: uuidv4(),
        photoURL: photoURL,
        uid: uid,
        uploadDate: Date.now(),
        username: displayName,
        fullName: fullname
      })
      newArray.splice(0, 1, newPost);
      setSelectedPost(newArray);
    } else {
      setIsButtonLiked(false);
      const newLikes = [...selectedPost[0].likes];
      const newPost = {...selectedPost[0], likes: newLikes};
      const newArray = [...selectedPost]
      newLikes.splice(alreadyLiked, 1);
      newArray.splice(0, 1, newPost);
      setSelectedPost(newArray);
    }
    await likeUploadToggle(postID);   
  }

  const navigateLikedBy = async (postID) => {
    await getPostData(postID);
    navigate(`/p/${postID}/liked_by`);
    setIsLoadingPage(false);
  }

  const getPostData = async () => {
    const { postID } = params;
    setDataLoading(true)
    const photoArray = [];
    const profilePhotoData = query(collection(db, 'photoUploads'), 
      where('postID', '==', postID), orderBy('index'));
    const profileImageDataSnap = await getDocs(profilePhotoData);
    profileImageDataSnap.forEach((doc) => {
      photoArray.push(doc.data());
    });
    const profilePostDocument = doc(db, 'postUploads', postID);
    const postSnap = await getDoc(profilePostDocument);

    console.log([postSnap.data(), ...photoArray]);
    setSelectedPost([postSnap.data(), ...photoArray]);
    setDataLoading(false);
  };

  const nextPhotoHandler = (event) => {
    event.stopPropagation();
    if (galleryIndex !== selectedPost[0].photos.length - 1) {
      setGalleryIndex(galleryIndex + 1);
      console.log(width * (galleryIndex + 1))
      setMovement(width * (galleryIndex + 1));
    }
  }

  const previousPhotoHandler = (event) => {
    event.stopPropagation();
    if (galleryIndex !== 0) {
      setGalleryIndex(galleryIndex - 1);
      console.log(galleryIndex - 1);
      setMovement(width * (galleryIndex - 1));
    }
  }

  const movementEndHandler = () => {
    console.log(movement);
    console.log(galleryIndex);
    setIsMoving(true);
    if ((galleryIndex === 0 && movement < 0)) {
      return
    } else {
      if ((movement - (width * galleryIndex)) > 50) {
        setGalleryIndex(galleryIndex + 1);
        console.log(width * (galleryIndex + 1))
        setMovement(width * (galleryIndex + 1));
      } else if ((movement - (width * galleryIndex)) < -50) {
        setGalleryIndex(galleryIndex - 1);
        console.log(galleryIndex - 1);
        setMovement(width * (galleryIndex - 1));
      } else {
        setMovement(width * galleryIndex);
      }      
    }
  }

  const movementStartHandler = (event) => {
    setIsMoving(false);
    setMovementStart(event.touches[0].clientX);
  }

  useEffect(() => {
    if (selectedPost === '') {
      getPostData()
    }
  }, []);

  if (selectedPost !== '') {
    console.log(selectedPost);
    const { 
      username,
      photoURL,
      postID,
      uploadDate,
      postCaption,
      comments,
      photos,
      likes,
    } = selectedPost[0];

    const liked = likes.findIndex((like) => like.uid === userData.uid);

    const postHiddenToggle = () => postHidden ? setPostHidden(false) : setPostHidden(true);

    const movementHandler = (event) => {
      if (galleryIndex === photos.length - 1 && (movementStart - event.touches[0].clientX) > 0) {
        return
      } else {
        setMovement((movementStart - event.touches[0].clientX) + (width * galleryIndex));        
      }
    }

    const navigateComments = (postID) => {
      navigate(`/p/${postID}/comments`)
    }
    
    return (
      <article className="post-images">
        <div className='profile-images-wrapper-feed'>
          <div key={postID} className='photo-post-feed'>
            <header className='feed-post-header'>
              <div className='profile-photo-username-wrapper'>
                <div className='feed-profile-photo-wrapper'>
                  <img alt={`${username}'s profile`} src={photoURL} className="feed-profile-photo"/> 
                </div>
                <span className='profile-username-header'>
                  {username}
                </span>
                <button className='post-links-modal'>
                  <svg aria-label="More options" className="elipsis-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>
                  </svg>
                </button>                    
              </div>

            </header>
            <div 
              className='photo-navigation-wrapper'
              style={{ 
                height: `${width / selectedPost[1].aspectRatio}px`, 
                paddingBottom: `${100 / selectedPost[1].aspectRatio}%`
              }}
              onTouchStart={onDoublePress}
              onTouchMove={movementHandler}
              onTouchEnd={movementEndHandler}
            >
              <div 
                className='photo-frames-wrapper'
                style={{
                  width: `${(width / selectedPost[1].aspectRatio) * photos.length}px`,
                  transform: `translateX(-${movement}px)`,
                  transition: `${isMoving ? 'all .2s ease-in-out' : ''}`
                }}
              >
                {selectedPost.map((photo, index) => {
                  if ((index === galleryIndex + 1 || index === galleryIndex + 2 || index === galleryIndex) && index !== 0) {
                    return (
                      <div
                        key={photo.photoID} 
                        className='feed-photo-frame'
                        style={{
                          transform: `translateX(${width * (index - 1)}px)`
                        }}
                      >
                        <img 
                          alt={postCaption} 
                          className='feed-photo-post-image' 
                          sizes='100vw'
                          srcSet={`
                            ${photo.w1080} 1080w,
                            ${photo.w750} 750w,
                            ${photo.w640} 640w,
                            ${photo.w480} 480w,
                            ${photo.w320} 320w,
                            ${photo.w240} 240w,
                            ${photo.w150} 150w
                          `}
                        />
                      </div>
                    )
                  }
                })}                
              </div>
              {isLiked &&
                <div className='double-click-heart'>
                  <div 
                    className='double-click-heart-sprite'
                    onAnimationEnd={() => setIsLiked(false)}  
                  >
                  </div>
                </div>                  
              }
              {photos.length > 1 &&
                <React.Fragment>
                  {galleryIndex !== (photos.length - 1) &&
                    <button 
                      className='next-photo-button'
                      onClick={nextPhotoHandler}
                    >
                      <div className='right-chevron-sprite'>
                      </div>  
                    </button>                  
                  }
                  {galleryIndex > 0 &&
                    <button 
                      className='previous-photo-button'
                      onClick={previousPhotoHandler}
                    >
                      <div className='left-chevron-sprite'>
                      </div>  
                    </button>                    
                  }
                  <div className='slide-indicator-wrapper'>
                    {photos.map((photo, index) => {
                      return (
                        <div key={photo} className={galleryIndex === index ? 'slide-indicator selected' : 'slide-indicator'}></div>
                      )
                    })}
                  </div>                       
                </React.Fragment>
              }     
            </div>
            <footer className='feed-post-footer'>
              <div className='feed-footer-buttons-wrapper'>
                <button 
                  className='feed-like-button'
                  onClick={likeHandler}
                >
                  {liked === -1 &&
                    <svg aria-label="Like" className="like-open-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                      <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
                    </svg>                      
                  }
                  {liked !== -1 &&
                    <svg aria-label="Unlike" className={isButtonLiked ? "like-filled-svg animated" : 'like-filled-svg'} color="#ed4956" fill="#ed4956" height="24" role="img" viewBox="0 0 48 48" width="24">
                      <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                    </svg>                      
                  }
                </button>
                <button 
                  className='feed-comment-button'
                  onClick={() => navigateComments(postID)}
                >
                  <svg aria-label="Comment" className="comment-button-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
                <button className='feed-share-button'>
                  <svg aria-label="Share Post" className="share-post-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                    <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                  </svg>
                </button>
                <button className='feed-save-button'>
                  <svg aria-label="Save" className="save-post-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                  </svg>
                </button>
              </div>
              {likes.length > 0 &&
                <button 
                  className='like-counter'
                  onClick={() => navigateLikedBy(postID)}
                >
                  {likes.length === 1
                    ? '1 like'
                    : `${likes.length} likes`
                  }
                </button>                  
              }
              <div className='post-caption-comments-wrapper'>
                {postCaption !== '' &&
                  <div className='post-caption-wrapper'>
                    <span className='caption-username'>
                      {username}
                    </span>
                    <span>&nbsp;</span>
                    {postCaption.length > 125 &&
                      <span className='post-caption-text'>
                        <span className='first-caption-section'>
                          {postCaption.substring(0, 125)}
                        </span>
                        {postHidden &&
                          <React.Fragment>
                            <span className='caption-elipsis'>...</span>
                            <button 
                              className='caption-more-button'
                              onClick={postHiddenToggle} 
                            >more</button> 
                          </React.Fragment>                     
                        }
                        {!postHidden &&
                          <span className='second-caption-section'>
                            {postCaption.substring(125)}
                          </span>
                        }
                      </span>                  
                    }
                    {postCaption.length < 125 &&
                      <span className='post-caption-text'>
                        {postCaption}                      
                      </span>
                    }
                  </div>                    
                }
                <div 
                  className='feed-post-comments-wrapper'
                  onClick={() => navigateComments(postID)}
                >
                  {comments.length !== 0 &&
                    <button className='view-comments-button'>
                      {comments.length === 1
                        ? `View 1 comment`
                        : `View all ${comments.length} comments`
                      }
                    </button>                
                  }
                </div>
                {comments.length > 2 &&
                  <ul className='featured-comments-list'>
                    {comments.map((comment, index) => {
                      const {
                        username,
                        text,
                        commentID
                      } = comment;
                      if (index <= 1) {
                        return (
                          <li 
                            key={commentID}
                            className='featured-comment-wrapper'>
                            <div className='comment-text-wrapper'>
                              <h2 className='comment-username'>
                                {username}
                              </h2>
                              <span className='comment-text'>
                                {text}
                              </span>                    
                            </div>
                          </li>                          
                        )
                      };
                      return ''
                    })}
                  </ul>              
                }
              </div>                  
              <div className='feed-post-timestamp'>
                <time>
                  {new Date(uploadDate).toDateString()}
                </time>
              </div>
            </footer>
          </div>
        </div>
      </article>
    );    
  } else {
    return (
      <div></div>
    )
  }

}

export default MobilePhotoPost;