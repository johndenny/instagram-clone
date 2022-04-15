import './UploadPhotoMobileDetails.css'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import firebaseApp from '../Firebase';
import {v4 as uuidv4} from 'uuid';

const storage = getStorage();
const db = getFirestore();

const UploadPhotoMobileDetails = (props) => {
  const {
    tagData,
    thumbnailImage,
    showNotification,
    photoUploadText,
    photoUploadTextHandler,
    editedPhoto,
    setPhotoUploadOpen, 
    profilePhotoURL,
    userData
  } = props;
  const navigate = useNavigate();
  const [sharingPost, setSharingPost] = useState(false);

  const uploadNewPost = async () => {
    setSharingPost(true);
    const id = uuidv4();
    const newPostRef = ref(storage, `photoUploads/${id}.jpg`);
    const newThumbnailRef = ref(storage, `photoUploadsThumbnails/${id}.jpg`);
    const photoUpload = await uploadBytes(newPostRef, editedPhoto);
    const thumbnailUpload = await uploadBytes(newThumbnailRef, thumbnailImage);
    const photoURL = await getDownloadURL(ref(storage, photoUpload.metadata.fullPath));
    const thumbnailURL = await getDownloadURL(ref(storage, thumbnailUpload.metadata.fullPath));
    await setDoc(doc(db, 'photoUploads', id), {
      photoID: id,
      photoURL: photoURL,
      thumbnailURL: thumbnailURL, 
      photoText: photoUploadText, 
      uid: userData.uid,
      uploadDate: Date.now(),
    });
    setSharingPost(false)
    navigate('/');
    setPhotoUploadOpen(false);
    showNotification('Your photo was posted.');
    console.log('Photo Uploaded', photoURL);
  }

  const shareNewPost = () => {
    uploadNewPost();
    
  }

  useEffect(() => {
    setPhotoUploadOpen(true);
  }, []);

  return (
    <section className='mobile-upload-photo-details'>
      <div className='upload-details-header-wrapper'>
        {sharingPost && 
          <React.Fragment>
            <div className='share-post-loading-bar'></div>
            <div className='loading-bar-modal'></div>            
          </React.Fragment>
        }
        <header className="new-post-header">
          {sharingPost 
            ? <div className="header-content-wrapper">
                
                <h1 className="new-post-header-text">Sharing...</h1>
              </div>
            : <div className="header-content-wrapper">
                <button className="close-new-post-button" onClick={() => navigate('/create/style')}>
                  <svg aria-label="Back" className="back-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <path d="M21 17.502a.997.997 0 01-.707-.293L12 8.913l-8.293 8.296a1 1 0 11-1.414-1.414l9-9.004a1.03 1.03 0 011.414 0l9 9.004A1 1 0 0121 17.502z"></path>
                  </svg>
                </button>
                <h1 className="new-post-header-text">New Post</h1>
                <button className="next-new-post-button" onClick={shareNewPost} >Share</button>
              </div>
          }

        </header>        
      </div>
      <div className='mobile-photo-details-wrapper'>
        <section className='mobile-photo-upload-text'>
          <div className='upload-text-profile-photo-wrapper'>
            <img alt={`${userData.displayName}'s profile`} className='upload-text-profile-photo' src={userData.photoURL} />
          </div>
          <div className='upload-textarea-wrapper'>
            <textarea
              onChange={photoUploadTextHandler}
              value={photoUploadText} 
              aria-label='Write a caption...' 
              placeholder='Write a caption...' 
              className='upload-textarea' 
              autoComplete='off' 
              autoCorrect='off'
            >
            </textarea>
            <div className='textarea-modal'></div>
          </div>
          <div className='upload-photo-preview-wrapper'>
            <img alt='Preview to be uploaded' className='upload-photo-preview' src={URL.createObjectURL(editedPhoto)} />
          </div>
        </section>
        <section className='write-alt-text-wrapper'>
          <button 
            className='write-alt-text-button'
            onClick={() => navigate('/create/tag/')}
          >
            <span className='alt-text'>Tag People</span>
            {tagData.length === 1 &&
              <span className='details-tags'>
                {tagData[0].username}
              </span>
            }
            {tagData.length > 1 &&
              <span className='details-tags'>
              {`${tagData.length} people`}
            </span>
            }
            <span className='sprite-right-chevron'></span>
          </button>
        </section>
      </div>
    </section>
  )
}

export default UploadPhotoMobileDetails;