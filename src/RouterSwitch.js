import './RouterSwitch.css';
import MobileNavigationBars from './components/MobileNavigationBars.js'
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Link, useNavigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import firebaseApp from "./Firebase"; 
import { getAuth, onAuthStateChanged, updateProfile} from "firebase/auth";
import NavigationBar from "./components/NavigationBar";
import Inbox from "./pages/Inbox";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import defaultProfileImage from "./images/default-profile-image.jpg";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import EditProfile from './pages/EditProfile';
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import UploadPhotoMobile from './pages/UploadPhotoMobile';

const auth = getAuth(firebaseApp);
const storage = getStorage();
const db = getFirestore();

const RouterSwitch = () => {
  const [userLoggedIn, setUserLoggedIn] = useState('');
  const [userData, setUserData] = useState({});
  const [profilePhotoURL, setProfilePhotoURL] = useState('');
  const [profileUpload, setProfileUpload] = useState('');
  const profileImageRef = ref(storage, `profilePhotos/${userData.uid}.jpg`);
  const [profilePhotoModal, setProfilePhotoModal] = useState(false);
  const [displayNotification, setDisplayNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [hideTopNavigation, setHideTopNavigation] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('');
  const [flippedAspectRatio, setFlippedAspectRatio] = useState('');
  const [mobilePhotoUpload, setMobilePhotoUpload] = useState('');

  const mobilePhotoUploadHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        console.log(image.naturalWidth/ image.naturalHeight);
        setAspectRatio(image.naturalWidth/ image.naturalHeight);
        setFlippedAspectRatio(image.naturalHeight / image.naturalWidth);
      }
      setMobilePhotoUpload(image.src);
    }
  }

  const toggleTopNavigation = (boolean) => {
    setHideTopNavigation(boolean)
  }

  const showNotification = (text) => {
    setNotificationText(text);
    setDisplayNotification(true);
    setTimeout(() => {
      setDisplayNotification(false)
    }, 4000);
  };

  const clearNotificationText = () => {
    if (!displayNotification) {
      setNotificationText('');      
    }
  }

  const profilePhotoModalToggle = () => {
    profilePhotoModal
      ? setProfilePhotoModal(false)
      : setProfilePhotoModal(true);
  };
  
  const removeProfilePhoto = async () => {
    profilePhotoModalToggle()
    await deleteObject(profileImageRef);
    await updateProfile(auth.currentUser, {
      photoURL: ''
    });
    await setDoc(doc(db, 'users', userData.uid), {photoURL: ''}, {merge: true});
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
    await setDoc(doc(db, 'users', userData.uid), {photoURL: photoURL}, {merge: true});
    showNotification('Profile photo added.')
    getProfilePhotoURL()
  }

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
    const yOffset = newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
    ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);

    canvas.toBlob((blob) => {
      const image = new Image();
      image.src = blob;
      uploadPhoto(blob);
    });
  }

  const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(user);
        setUserData(user)
        setUserLoggedIn(true);
      }
      else {
        setUserLoggedIn(false);
      }
    })
  }

  useEffect(() => {
    monitorAuthState();
  }, []);

  const getProfilePhotoURL = () => {
    const { photoURL } = userData;
    photoURL === '' 
    ? setProfilePhotoURL(defaultProfileImage)
    : setProfilePhotoURL(userData.photoURL);
  }

  const checkForMobile = () => {
    if (/Mobi|Andriod/i.test(navigator.userAgent)) {
      setIsMobile(true);
      console.log('isMobile');
    }
  }

  useEffect(() => {
    getProfilePhotoURL();
    checkForMobile();
  }, []);

  return (
    <BrowserRouter>
      <section className="entire-wrapper">
        {(userLoggedIn && !isMobile) &&
          <NavigationBar getProfilePhotoURL={getProfilePhotoURL} profilePhotoURL={profilePhotoURL} userData={userData}/>
        }
        {(userLoggedIn && isMobile && mobilePhotoUpload === '') &&
          <MobileNavigationBars mobilePhotoUploadHandler={mobilePhotoUploadHandler} toggleTopNavigation={toggleTopNavigation} hideTopNavigation={hideTopNavigation} getProfilePhotoURL={getProfilePhotoURL} profilePhotoURL={profilePhotoURL} userData={userData}/>
        }
        <Routes>
          {userLoggedIn === '' &&
            <React.Fragment>
              <Route path='/' element={<div></div>} />
              <Route path='/accounts/emailsignup' element={<div></div>} />            
            </React.Fragment>
          }
          {!userLoggedIn &&
            <React.Fragment>
              <Route path='/' element={<LogIn />} />
              <Route path='/accounts/emailsignup' element={<SignUp />} />
            </React.Fragment>
          }
          {userLoggedIn &&
            <React.Fragment>
              <Route path='/' element={<Homepage/>} />
              <Route path='/direct/inbox' element={<Inbox />} />
              <Route path='/explore/' element={<Explore />} />
              <Route path='/accounts/edit' element={
                <EditProfile
                  showNotification={showNotification} 
                  profilePhotoModal={profilePhotoModal} 
                  profilePhotoModalToggle={profilePhotoModalToggle} 
                  removeProfilePhoto={removeProfilePhoto} 
                  uploadHandler={uploadHandler} 
                  uploadClick={uploadClick} 
                  getProfilePhotoURL={getProfilePhotoURL} 
                  profilePhotoURL={profilePhotoURL} 
                  userData={userData}/>} 
                />
              <Route path='/create/style' element={<UploadPhotoMobile 
                flippedAspectRatio={flippedAspectRatio} 
                aspectRatio={aspectRatio} 
                mobilePhotoUpload={mobilePhotoUpload} 
                setMobilePhotoUpload={setMobilePhotoUpload}
              />} />            
            </React.Fragment>
          }
          <Route path='/:username' element={
            <Profile
              toggleTopNavigation={toggleTopNavigation}
              profilePhotoModal={profilePhotoModal} 
              profilePhotoModalToggle={profilePhotoModalToggle} 
              removeProfilePhoto={removeProfilePhoto} 
              uploadHandler={uploadHandler} 
              uploadClick={uploadClick} 
              getProfilePhotoURL={getProfilePhotoURL} 
              profilePhotoURL={profilePhotoURL} 
              userData={userData}
            />} 
          />
          <Route path='*' element={<div className="no-user-profile">
            <h2 className="no-user-header">Sorry, this page isn't availble.</h2>
            <div className="no-user-text">The link you followed may be broken, or the page may have been removed. <Link to='/'>Go Back to Instagram.</Link></div>
          </div>} />
        </Routes>
      </section>
      <div className='bottom-notification-bar'>
        <div 
          className={displayNotification ? ['notification-bar-content', 'slide-up'].join(' ') : ['notification-bar-content', 'slide-down'].join(' ')} 
          onTransitionEnd={clearNotificationText} 
        >
          {notificationText}          
        </div>
      </div>
    </BrowserRouter>
  );
}

export default RouterSwitch;