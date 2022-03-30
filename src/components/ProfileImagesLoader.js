import './ProfileImagesLoader.css'
import useWindowSize from '../hooks/useWindowSize';
import { useEffect, useState } from 'react';

const ProfileImagesLoader = (props) => {
  const {
    isMobile,
    profileData,
    pageSelected,
    photosArray,
  } = props;
  const [width, height] = useWindowSize();
  const [photoWidth, setPhotoWidth] = useState(0);

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
    imageSizeHandler();
  }, [width]);

  return (
    <article className="profile-images">
      {pageSelected !== 'feed' &&
        <div className="profile-images-wrapper">
          {photosArray.map((post) => {
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
              <div key={photoID} className="photo-post">
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
          {photosArray.map((post) => {
            const {
              postID,
              postCaption,
              uploadDate,
            } = post[0]
            const {
              aspectRatio
            } = post[1]
            const {
              username,
              photoURL
            } = profileData
            console.log(aspectRatio)
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
                    <button className='post-links-modal'>
                      <svg aria-label="More options" className="elipsis-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>
                      </svg>
                    </button>                    
                  </div>

                </header>
                <div 
                  className='feed-photo-frame'
                  style={{paddingBottom: `${100 / aspectRatio}%`}}
                >
                  <img 
                    alt={postCaption} 
                    className='feed-photo-post-image' 
                    sizes='100vw'
                    srcSet={`
                      ${post[1].w1080} 1080w,
                      ${post[1].w750} 750w,
                      ${post[1].w640} 640w,
                      ${post[1].w480} 480w,
                      ${post[1].w320} 320w,
                      ${post[1].w240} 240w,
                      ${post[1].w150} 150w
                    `}
                  />
                </div>
                <footer className='feed-post-footer'>
                  <div className='feed-footer-buttons-wrapper'>
                    <button className='feed-like-button'>
                      <svg aria-label="Like" className="like-open-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
                      </svg>
                    </button>
                    <button className='feed-comment-button'>
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
                  <div className='post-caption-comments-wrapper'>
                    {postCaption !== '' &&
                      <div className='post-caption-wrapper'>
                        <span className='caption-username'>
                          {username}
                        </span>
                        <span>&nbsp;</span>
                        <span className='post-caption-text'>
                          {postCaption}
                        </span>
                      </div>                    
                    }
                    <div className='feed-post-comments-wrapper'>
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