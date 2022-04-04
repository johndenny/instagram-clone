import './ProfileImagesLoader.css'
import useWindowSize from '../hooks/useWindowSize';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

let lastPress = 0;

const ProfileImagesLoader = (props) => {
  const {
    likeUploadToggle,
    setPhotosArray,
    userData,
    setIsLoadingPage,
    postLinksModalHandler,
    getPostData,
    isMobile,
    profileData,
    pageSelected,
    photosArray,
  } = props;
  const navigate = useNavigate();
  const [width, height] = useWindowSize();
  const [photoWidth, setPhotoWidth] = useState(0);
  const [fullText, setFullText] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState('');
  const [movement, setMovement] = useState('');
  const [movementStart, setMovementStart] = useState('');
  const [isMoving, setIsMoving] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const onDoublePress = (index, event) => {
    const time = new Date().getTime();
    const delta = time - lastPress;

    const DOUBLE_PRESS_DELAY = 400;
    if (delta < DOUBLE_PRESS_DELAY) {
        console.log('double press');
        const newIsLiked = [...isLiked];
        newIsLiked.splice(index, 1, true);
        setIsLiked(newIsLiked);
        const alreadyLiked = photosArray[index][0].likes.findIndex((like) => like.uid === userData.uid);
        if (alreadyLiked === -1) {
        likeHandler(index);
        }
    } else {
      movementStartHandler(event);
    }
    lastPress = time;
  };

  const setIsLikedFalse = (index) => {
    const newIsLiked = [...isLiked];
    newIsLiked.splice(index, 1, false);
    setIsLiked(newIsLiked);
  }

  const likeHandler = async (index) => {
    const {
      photoURL,
      uid,
      displayName,
      fullname
    } = userData;
    const { postID } = photosArray[index][0];   
    const alreadyLiked = photosArray[index][0].likes.findIndex((like) => like.uid === uid);
    if (alreadyLiked === -1) {
      const newLikes = [...photosArray[index][0].likes];
      const newPost = {...photosArray[index][0], likes: newLikes};
      const newArray = [...photosArray[index]];
      const fullPost = [...photosArray]
      newLikes.push({
        likeID: uuidv4(),
        photoURL: photoURL,
        uid: uid,
        uploadDate: Date.now(),
        username: displayName,
        fullName: fullname
      })
      newArray.splice(0, 1, newPost);
      fullPost.splice(index, 1, newArray);
      setPhotosArray(fullPost);      
    } else {
      const newLikes = [...photosArray[index][0].likes];
      const newPost = {...photosArray[index][0], likes: newLikes};
      const newArray = [...photosArray[index]];
      const fullPost = [...photosArray]
      newLikes.splice(alreadyLiked, 1);
      newArray.splice(0, 1, newPost);
      fullPost.splice(index, 1, newArray);
      setPhotosArray(fullPost);    
    }
    await likeUploadToggle(postID);   
  }


  const movementEndHandler = (index) => {
    const newGalleryIndex = [...galleryIndex];
    const newMovement = [...movement];
    setIsMoving(true);
    if ((galleryIndex[index] === 0 && movement[index] < 0)) {
      return
    } else {
      if ((movement[index] - (width * galleryIndex[index])) > 50) {
        newGalleryIndex.splice(index, 1, galleryIndex[index] + 1);
        setGalleryIndex(newGalleryIndex);
        newMovement.splice(index, 1, width * (galleryIndex[index] + 1));
        setMovement(newMovement);
      } else if ((movement[index] - (width * galleryIndex[index])) < -50) {
        newGalleryIndex.splice(index, 1, galleryIndex[index] - 1);
        setGalleryIndex(newGalleryIndex);
        newMovement.splice(index, 1, width * (galleryIndex[index] - 1));
        setMovement(newMovement);
      } else {
        newMovement.splice(index, 1, width * galleryIndex[index]);
        setMovement(newMovement);
      }      
    }
  }

  const movementStartHandler = (event) => {
    setIsMoving(false);
    setMovementStart(event.touches[0].clientX);
  }

  const movementHandler = (index, event) => {
    if (galleryIndex[index] === photosArray[index][0].photos.length - 1 && (movementStart - event.touches[0].clientX) > 0) {
      return
    } else {
      const newMovement = [...movement];
      newMovement.splice(index, 1, (movementStart - event.touches[0].clientX) + (width * galleryIndex[index]))
      setMovement(newMovement);        
    }
  }

  const nextPhotoHandler = (index) => {
    const newMovement = [...movement];
    console.log(galleryIndex);
    const newGalleryIndex = [...galleryIndex];
    newGalleryIndex.splice(index, 1, galleryIndex[index] + 1)
    setGalleryIndex(newGalleryIndex);
    newMovement.splice(index, 1, width * (galleryIndex[index] + 1));
    setMovement(newMovement);
  }

  const previousPhotoHandler = (index) => {
    const newMovement = [...movement]
    const newGalleryIndex = [...galleryIndex];
    newGalleryIndex.splice(index, 1, galleryIndex[index] - 1)
    setGalleryIndex(newGalleryIndex);
    newMovement.splice(index, 1, width * (galleryIndex[index] - 1));
    setMovement(newMovement);
  }

  const imageSizeHandler = () => {
    let newWidth;
    if (width > 736) {
      newWidth = (width - 96) / 3;
      if (newWidth > 293) {
        newWidth = 293;
      };      
    } else {
      newWidth = (width - 6) / 3;
    }
    setPhotoWidth(newWidth);
  }

  useEffect(() => {
    setGalleryIndex(new Array(12).fill(0));
    setMovement(new Array(12).fill(0));
    setIsLiked(new Array(12).fill(false));
  },[]);

  useEffect(() => {
    imageSizeHandler();
  }, [width]);

  const navigateMobileComments = async (index) => {
    const { postID } = photosArray[index][0];
    await getPostData(postID);
    navigate(`/p/${postID}/comments`);
    setIsLoadingPage(false);
  }

  const navigateMobilePost = async (postID) => {
    await getPostData(postID);
    navigate(`/p/${postID}`);
    setIsLoadingPage(false);
  }

  const navigateLikedBy = async (postID) => {
    await getPostData(postID);
    navigate(`/p/${postID}/liked_by`);
    setIsLoadingPage(false);
  }

  const postHiddenToggle = (postID) => {
    setFullText(prevState => {
      return [...prevState, postID]
    })
  }

  return (
    <article className="profile-images">
      {pageSelected !== 'feed' &&
        <div className="profile-images-wrapper">
          {photosArray.map((post) => {
            const {
              postID
            } = post[0];
            const {
              photoID,
              aspectRatio,
              captionText,
            } = post[1];
            let photoCenter;
            if (aspectRatio > 1) {
              photoCenter = {
                left: `-${((photoWidth * aspectRatio) - photoWidth) / 2}px`
              }
            } else if (aspectRatio < 1) {
              console.log(aspectRatio, photoWidth);
              photoCenter = {
                top: `-${((photoWidth / aspectRatio) - photoWidth) / 2}px`
              }
            }
            return (
              <div 
                key={photoID} 
                className="photo-post"
                onClick={() => navigateMobilePost(postID)}
              >
                <div className="photo-post-padding">
                  <img 
                    alt={captionText} 
                    className='photo-post-image' 
                    sizes={aspectRatio > 1 ? `${photoWidth * aspectRatio}px` : `${photoWidth}px`} 
                    srcSet={`
                      ${post[1].w1080} 1080w,
                      ${post[1].w750} 750w,
                      ${post[1].w640} 640w,
                      ${post[1].w480} 480w,
                      ${post[1].w320} 320w,
                      ${post[1].w240} 240w,
                      ${post[1].w150} 150w
                    `}
                    style={photoCenter}
                  />
                </div>
              </div>
            )
          })}
        </div>      
      }
      {pageSelected === 'feed' &&
        <div className='profile-images-wrapper-feed'>
          {photosArray.map((post, index) => {
            const postIndex = index
            const {
              postID,
              postCaption,
              uploadDate,
              likes,
              comments,
              photos
            } = post[0]
            const {
              aspectRatio
            } = post[1]
            const {
              username,
              photoURL
            } = profileData
            let postHidden;
            const isTextHidden = fullText.findIndex((id) => id === postID)
            if ( isTextHidden === -1) {
              postHidden = true;
            } else {
              postHidden = false;
            }
            const liked = likes.findIndex((like) => like.uid === userData.uid);
            return (
              <div key={postID} className='photo-post-feed'>
                <header className='feed-post-header'>
                  <div className='profile-photo-username-wrapper'>
                    <div className='feed-profile-photo-wrapper'>
                      <img alt={`${username}'s profile`} src={photoURL} className="feed-profile-photo"/> 
                    </div>
                    <span className='profile-username-header'>
                      {username}
                    </span>
                    <button className='post-links-modal' onClick={() => postLinksModalHandler(postIndex)}>
                      <svg aria-label="More options" className="elipsis-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>
                      </svg>
                    </button>                    
                  </div>

                </header>
                <div 
                  className='photo-navigation-wrapper'
                  style={{ 
                    height: `${width / aspectRatio}px`, 
                    paddingBottom: `${100 / aspectRatio}%`
                  }}
                  onTouchStart={onDoublePress.bind(null, index)}
                  onTouchMove={movementHandler.bind(null, index)}
                  onTouchEnd={() => movementEndHandler(index)}
                >
                  <div 
                    className='photo-frames-wrapper'
                    style={{
                      width: `${(width / aspectRatio) * photos.length}px`,
                      transform: `translateX(-${movement[postIndex]}px)`,
                      transition: `${isMoving ? 'all .2s ease-in-out' : ''}`
                    }}
                  >
                    {post.map((photo, index) => {
                      if ((index === galleryIndex[postIndex] + 1 || index === galleryIndex[postIndex] + 2 || index === galleryIndex[postIndex]) && index !== 0) {
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
                  {isLiked[index] &&
                    <div className='double-click-heart'>
                      <div 
                        className='double-click-heart-sprite'
                        onAnimationEnd={() => setIsLikedFalse(index)}  
                      >
                      </div>
                    </div>                  
                  }
                  {photos.length > 1 &&
                    <React.Fragment>
                      {galleryIndex[postIndex] !== (photos.length - 1) &&
                        <button 
                          className='next-photo-button'
                          onClick={() => nextPhotoHandler(postIndex)}
                        >
                          <div className='right-chevron-sprite'>
                          </div>  
                        </button>                  
                      }
                      {galleryIndex[postIndex] > 0 &&
                        <button 
                          className='previous-photo-button'
                          onClick={() => previousPhotoHandler(postIndex)}
                        >
                          <div className='left-chevron-sprite'>
                          </div>  
                        </button>                    
                      }
                      <div className='slide-indicator-wrapper'>
                        {photos.map((photo, index) => {
                          return (
                            <div key={photo} className={galleryIndex[postIndex] === index ? 'slide-indicator selected' : 'slide-indicator'}></div>
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
                      onClick={() => likeHandler(index)}  
                    >
                      {liked === -1 &&
                        <svg aria-label="Like" className="like-open-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                          <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
                        </svg>                      
                      }
                      {liked !== -1 &&
                        <svg aria-label="Unlike" className="like-filled-svg" color="#ed4956" fill="#ed4956" height="24" role="img" viewBox="0 0 48 48" width="24">
                          <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                        </svg>                      
                      }
                    </button>
                    <button 
                      className='feed-comment-button'
                      onClick={() => navigateMobileComments(index)}
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
                                  onClick={() => postHiddenToggle(postID)} 
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
                    <div className='feed-post-comments-wrapper'>
                      {comments.length !== 0 &&
                        <button 
                          className='view-comments-button'
                          onClick={() => navigateMobileComments(index)}
                        >
                          {comments.length === 1
                            ? `View 1 comment`
                            : `View all ${comments.length} comments`
                          }
                        </button>                
                      }
                    </div>
                  </div>                  
                  <div className='feed-post-timestamp'>
                    <time>
                      {new Date(uploadDate).toDateString()}
                    </time>
                  </div>
                </footer>
              </div>
            )
          })}
        </div>
      }
    </article>
  );
};

export default ProfileImagesLoader