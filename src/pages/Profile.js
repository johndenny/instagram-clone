import defaultProfileImage from "../images/default-profile-image.jpg";
import './Profile.css';
import firebaseApp from "../Firebase";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAuth, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import ProfilePhotoModal from "../components/ProfilePhotoModal";

const storage = getStorage();
const auth = getAuth();

const Profile = (props) => {
  const { userData, getProfilePhotoURL, profilePhotoURL } = props;
  const [profileUpload, setProfileUpload] = useState('');
  const [profilePhotoModal, setProfilePhotoModal] = useState(false);
  const profileImageRef = ref(storage, `profilePhotos/${userData.uid}.jpg`);

  const profilePhotoModalToggle = () => {
    profilePhotoModal
      ? setProfilePhotoModal(false)
      : setProfilePhotoModal(true);
  };

  const removeProfilePhoto = async () => {
    profilePhotoModalToggle();
    await deleteObject(profileImageRef);
    await updateProfile(auth.currentUser, {
      photoURL: ''
    });
    getProfilePhotoURL();
  }

  useEffect(() => {
    if (profileUpload !== '') {
      if (profilePhotoModal === true) {
        setProfilePhotoModal(false);
      };
    resizeImage();      
    };
  },[profileUpload]);

  const uploadPhoto = async (blob) => {
    const photoUpload = await uploadBytes(profileImageRef, blob);
    const photoURL = await getDownloadURL(ref(storage, photoUpload.metadata.fullPath))
    setProfileUpload('');
    console.log(photoUpload);
    await updateProfile(auth.currentUser, {
      photoURL: photoURL
    });
    getProfilePhotoURL()
  }

  useEffect(() => {
      getProfilePhotoURL();      
  }, [userData]);

  const uploadHandler = (event) => {
    const {files} = event.target;
    setProfileUpload(files[0]);
  }

  const uploadClick = (event) => {
    event.target.value = null;
  }

  const resizeImage = () => {
    const reader = new FileReader();
    const img = new Image();
    img.crossOrigin = "anonymous";
    reader.onload = () => {
      img.onload = function() {
        canvas_scale(img)
      }; 
      img.src = reader.result;      
    };
    reader.readAsDataURL(profileUpload);
  }

  function canvas_scale(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");

    canvas.width = 150;
    canvas.height = 150;

    ctx.globalCompositeOperation = 'destination-under';
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const ratio = img.width / img.height;
    let newWidth = canvas.width;
    let newHeight = newWidth / ratio;
    if (newHeight < canvas.height) {
      newHeight = canvas.height;
      newWidth = newHeight * ratio;
    }
    const xOffset = newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0;
    const yOffset =
      newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
    ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);

    canvas.toBlob((blob) => {
      const image = new Image();
      image.src = blob;
      uploadPhoto(blob);
    });
  }

  return (
    <main className="profile-wrapper">
      {profilePhotoModal &&
        <ProfilePhotoModal uploadClick={uploadClick} uploadHandler={uploadHandler} removeProfilePhoto={removeProfilePhoto} profilePhotoModalToggle={profilePhotoModalToggle}/>      
      }
      <div className="profile">
        <header className="profile-header">
          <div className="profile-image">
            <button className="profile-image-button" onClick={profilePhotoModalToggle}>
              <label htmlFor="profile-image-upload" className={profilePhotoURL === null ? "upload-profile-image" : ["upload-profile-image", "hidden"].join(' ')}>
                {profilePhotoURL !== null
                  ? <img alt="" src={profilePhotoURL}/>
                  : <img alt="" src={defaultProfileImage}/>
                }
              </label>
              <form className="upload-profile-form">
                <input id='profile-image-upload'accept="image/jpeg,image/png" className="upload-profile-input" type='file' onClick={uploadClick} onChange={uploadHandler}/>
              </form>
            </button>
          </div>
          <section className="profile-details">
            <div className="top-details">
              <h2 className="displayName">
                {userData.displayName}
              </h2>
              <div className="edit-profile-button-wrapper">
                <div className="edit-profile-button">
                  Edit Profile
                </div>
              </div>
              <div className="settings-quick-links-wrapper">
                <button className="setting-quick-links-button">
                  <svg aria-label="Options" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                    <path d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="profile-numbers-wrapper">
              <ul className="profile-numbers-list">
                <li className="posts-number-wrapper">
                  <span className="posts-made">9</span>
                  {' posts'}
                </li>
                <li className="followers-number-wrapper">
                  <div className="followers-link">
                    <span className="followers">11</span>
                    {' followers'}
                  </div>
                </li>
                <li className="following-number-wrapper">
                  <div className="following-link">
                    <span className="following-number">45</span>
                    {' following'}
                  </div>
                </li>
              </ul>
            </div>
            <div className="profile-text-block">
              <div className="profile-full-name">mister man</div>
              <div className="profile-bio-text">hello hello hello hello hello</div>
              <a href="www.google.com">www.google.com</a>
            </div>
          </section>
        </header>
      </div>
    </main>
  )
};

export default Profile;

