import './MobilePhotoPost.css'
import firebaseApp from '../Firebase';
import { getFirestore, query, collection, where, orderBy, getDocs, doc, getDoc} from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const db = getFirestore()

const MobilePhotoPost = (props) => {
  const { 
    selectedPost,
    setSelectedPost 
  } = props;
  const { 
    username,
    photoURL,
    postID,
    uploadDate,
    postCaption,
    comments,
  } = selectedPost[0];
  const params = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [postDocument, setPostDocument] = useState('');
  const [userData, setUserData] = useState('');
  const [postHidden, setPostHidden] = useState(true);

  const postHiddenToggle = () => postHidden ? setPostHidden(false) : setPostHidden(true);

  const getPostData = async () => {
    const { postID } = params;
    const photoArray = [];
    const profilePhotoData = query(collection(db, 'photoUploads'), 
    where('postID', '==', postID), orderBy('index', 'desc'));
    const profileImageDataSnap = await getDocs(profilePhotoData);
    profileImageDataSnap.forEach((doc) => {
      photoArray.push(doc.data());
    });
    const profilePostDocument = doc(db, 'postUploads', postID);
    const postSnap = await getDoc(profilePostDocument);
    const { uid } = postSnap.data();
    const userDataDocument = doc(db, 'users', uid);
    const userSnap = await getDoc(userDataDocument);
    setUserData(userSnap.data());
    setPhotos(photoArray);
    setPostDocument(postSnap.data());
  };

  const navigateComments = (postID) => {
    navigate(`/p/${postID}/comments`)
  }


  return (
    <article className="profile-images">
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
            className='feed-photo-frame'
            style={{paddingBottom: `${100 / selectedPost[1].aspectRatio}%`}}
          >
            <img 
              alt={postCaption} 
              className='feed-photo-post-image' 
              sizes='100vw'
              srcSet={`
                ${selectedPost[1].w1080} 1080w,
                ${selectedPost[1].w750} 750w,
                ${selectedPost[1].w640} 640w,
                ${selectedPost[1].w480} 480w,
                ${selectedPost[1].w320} 320w,
                ${selectedPost[1].w240} 240w,
                ${selectedPost[1].w150} 150w
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
                      text
                    } = comment;
                    if (index <= 1) {
                      return (
                        <li className='featured-comment-wrapper'>
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
}

export default MobilePhotoPost;