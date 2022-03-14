import './RouterSwitch.css';
import MobileNavigationBars from './components/MobileNavigationBars.js'
import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Route, Routes, Link, } from "react-router-dom";
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
import UploadPhotoMobileDetails from './pages/UploadPhotoMobileDetails';
import uniqid from 'uniqid'

const auth = getAuth(firebaseApp);
const storage = getStorage();
const db = getFirestore();

const RouterSwitch = () => {
  // Site Wide //

  const [userLoggedIn, setUserLoggedIn] = useState('');
  const [userData, setUserData] = useState({});
  const [displayNotification, setDisplayNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [hideTopNavigation, setHideTopNavigation] = useState(false);

  // Profile Upload //

  const [profilePhotoURL, setProfilePhotoURL] = useState('');
  const [profileUpload, setProfileUpload] = useState('');
  const profileImageRef = ref(storage, `profilePhotos/${userData.uid}.jpg`);
  const [profilePhotoModal, setProfilePhotoModal] = useState(false);


  // Image Upload //

  const [aspectRatio, setAspectRatio] = useState('');
  const [flippedAspectRatio, setFlippedAspectRatio] = useState('');
  const [mobilePhotoUpload, setMobilePhotoUpload] = useState('');
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false);
  const [editedPhoto, setEditedPhoto] = useState('');
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [pointerX, setPointerX] = useState(0);
  const [pointerY, setPointerY] = useState(0);
  const [imageFitHeight, setImageFitHeight] = useState(true);
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [imageDegrees, setImageDegrees] = useState(0);
  const [originPointY, setOriginPointY] = useState(50);
  const [lastOrginY, setLastOriginY] = useState(50);
  const [originPointX, setOriginPointX] = useState(50);
  const [lastOrginX, setLastOriginX] = useState(50);
  const [imageFlipped, setImageFlipped] = useState(false);
  const [imageOrientation, setImageOrientation] = useState('horizontal-up')
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [pointerStartXY, setPointerStartXY] = useState({});
  const [filterScrollLeft, setFilterScrollLeft] = useState(0);
  const [photoUploadText, setPhotoUploadText] = useState('');
  const canvasRef = useRef(null);
  const shortestImageRatio = 1080/565;
  const widestImageRatio = 1080/1350;

  const photoUploadTextHandler = (event) => {
    const { value } = event.target;
    setPhotoUploadText(value);
  }

  useEffect(() => {
    if (!photoUploadOpen) {
      console.log('unmount')
      centerImage();
      imageLoad();
      setImageDegrees(0);
      setImageOrientation('horizontal-up');
      setSelectedFilter('normal');
      setImageFlipped(false);
      setImageFitHeight(true);
      setFilterScrollLeft(0);
      setPhotoUploadText('');
    }
  }, [photoUploadOpen]);

  useEffect(() => {
    centerImage();
    imageLoad();
  },[aspectRatio, flippedAspectRatio]);

  useEffect(() => {
    imageHandler();
  }, [imageFitHeight]);

  useEffect(() => {
    if (!imageFitHeight) {
      imageHandler();
    };
  }, [imageFlipped]);

  useEffect(() => {
    resizeCropFilterImage(true);
  }, [imageX, imageY, selectedFilter])

  const pointerStart = (event) => {
    const x = event.screenX
    const y = event.screenY
    setPointerStartXY({ 
      x: x, 
      y: y
    });
  }

  const pointerTracker = (event) => {
    let x;
    let y;
    if (imageOrientation === 'vertical-up') {
      y = (pointerStartXY.x - event.screenX) * -1;
      x = (pointerStartXY.y - event.screenY);
    } else if (imageOrientation === 'horizontal-down') {
      x = (pointerStartXY.x - event.screenX);
      y = (pointerStartXY.y - event.screenY);
    } else if (imageOrientation === 'vertical-down') {
      y = (pointerStartXY.x - event.screenX);
      x = (pointerStartXY.y - event.screenY) * -1;
    } else {
      x = (pointerStartXY.x - event.screenX) * -1;
      y = (pointerStartXY.y - event.screenY) * -1;  
    }
    if (imageFitHeight) {
      setPointerX((x/4) + imageX);
      setPointerY((y/4) + imageY);
      setOriginPointX(lastOrginX - (((y/4) / (imageHeight / 2)) * 50));
      setOriginPointY(lastOrginY - (((x/4) / (imageWidth / 2)) * 50));    
    }
  };

  const imageLocationHandler = () => {
    if (imageFitHeight) {
      if (pointerY !== 0) {
        setPointerY(0);
        setImageY(0);
        setLastOriginX(50);
        setOriginPointX(50);
      }
      if (pointerX <= ((aspectRatio * 100) - 100) * -1) {
        setPointerX(((aspectRatio * 100) - 100) * -1);
        setImageX(((aspectRatio * 100) - 100) * -1);
        setOriginPointY(50 + ((((imageWidth - 100) / 2) / (imageWidth / 2)) * 50));
        setLastOriginY(50 + ((((imageWidth - 100) / 2) / (imageWidth / 2)) * 50));
        return
      }
    }
    if (pointerX >= 0) {
      setPointerX(0);
      setImageX(0);
      setOriginPointY(50 - ((((imageWidth - 100) / 2) / (imageWidth / 2)) * 50));
      setLastOriginY(50 - ((((imageWidth - 100) / 2) / (imageWidth / 2)) * 50));
      return
    }
    setImageX(pointerX);
    setLastOriginY(originPointY);
  }

  const verticalImageHandler = () => {
    if (imageFitHeight) {
      if (pointerX !== 0) {
        setPointerX(0);
        setImageX(0);
        setLastOriginY(50);
        setOriginPointY(50);
      }
      if (pointerY <= ((flippedAspectRatio * 100) - 100) * -1) {
        setPointerY(((flippedAspectRatio * 100) - 100) * -1);
        setImageY(((flippedAspectRatio * 100) - 100) * -1);
        setOriginPointX(50 + ((((imageHeight - 100) / 2) / (imageHeight / 2)) * 50));
        setLastOriginX(50 + ((((imageHeight - 100) / 2) / (imageHeight / 2)) * 50));
        return
      }
    }
    if (pointerY >= 0) {
      setPointerY(0);
      setImageY(0);
      setOriginPointX(50 - ((((imageHeight - 100) / 2) / (imageHeight / 2)) * 50));
      setLastOriginX(50 - ((((imageHeight - 100) / 2) / (imageHeight / 2)) * 50));
      return
    }
    setImageY(pointerY);
    setLastOriginX(originPointX);
  }

  const centerImage = () => {
    const percent = (((aspectRatio * 100) - 100) / 2) * -1;
    const verticalPercent = (((flippedAspectRatio * 100) - 100) / 2) * -1;
    if (aspectRatio < 1) {
      setImageX(0);
      setPointerX(0);
      setPointerY(verticalPercent);
      setImageY(verticalPercent);
    } 
    if (aspectRatio > 1) {
      setPointerY(0);
      setImageY(0);    
      setPointerX(percent);
      setImageX(percent);
    }
    setLastOriginX(50);
    setOriginPointX(50);
    setLastOriginY(50);
    setOriginPointY(50);
  }

  const toggleImageFit = () => {
    if (!imageFitHeight) {
      setImageFitHeight(true)
      const percent = (((aspectRatio * 100) - 100) / 2) * -1;
      setPointerX(percent);
      setImageX(percent);
      setPointerY(0);
      setImageY(0);
    } else {
      setImageFitHeight(false);
      let percent;
      if (flippedAspectRatio * 100 < 52.356) {
        percent = (((shortestImageRatio * 100) - 100) / 4);
        setPointerX((((aspectRatio * 52.356) - 100) / 2) * -1);
        setImageX((((aspectRatio * 52.356) - 100) / 2) * -1);
        setPointerY(percent);
        setImageY(percent);
      } else {
        percent = (((flippedAspectRatio * 100) - 100) / 2) * -1;
        setPointerX(0);
        setImageX(0);
        setPointerY(percent);
        setImageY(percent);
      }
    }
    setLastOriginX(50);
    setOriginPointX(50);
    setLastOriginY(50);
    setOriginPointY(50);
  };

  const verticalToggleFit = () => {
    if (!imageFitHeight) {
      setImageFitHeight(true);
      const verticalPercent = (((flippedAspectRatio * 100) - 100) / 2) * -1;
      setPointerX(0);
      setImageX(0);
      setPointerY(verticalPercent);
      setImageY(verticalPercent);
    } else {
      setImageFitHeight(false);
      let percent;
      if (aspectRatio * 100 < 80) {
        percent = 10;
        setPointerY((((flippedAspectRatio * 80) - 100) / 2) * -1);
        setImageY((((flippedAspectRatio * 80) - 100) / 2) * -1);
        setPointerX(percent);
        setImageX(percent);
      } else {
        percent = ((aspectRatio * 100) - 100) / 2;
        setPointerY(0);
        setImageY(0)
        setPointerX(percent);
        setImageX(percent);
      }
    }
    setLastOriginX(50);
    setOriginPointX(50);
    setLastOriginY(50);
    setOriginPointY(50);
  }

  const imageHandler = () => {
    if (aspectRatio < 1) {
      if (!imageFitHeight) {
        if (imageFlipped) {
          const imageWidth = (aspectRatio * 100) < 52.356 ? 52.356 : ((aspectRatio * 100));
          setImageHeight((aspectRatio * 100) < 52.356 ? aspectRatio * 52.356 : 100);
          setImageWidth(imageWidth);
          setPointerY(0);
          setImageY(0);
          setPointerX((100 - imageWidth) / 2);
          setImageX((100 - imageWidth) / 2);
          setOriginPointX(50);
          setLastOriginX(50);
          setOriginPointY(50);
          setLastOriginY(50);
          return
        }
        let percent;
        if (aspectRatio * 100 < 80) {
          percent = 10;
          setPointerY((((flippedAspectRatio * 80) - 100) / 2) * -1);
          setImageY((((flippedAspectRatio * 80) - 100) / 2) * -1);
          setPointerX(percent);
          setImageX(percent);
        } else {
          percent = ((aspectRatio * 100) - 100) / 2;
          setPointerY(0);
          setImageY(0)
          setPointerX(percent);
          setImageX(percent);
        }
        setImageHeight((aspectRatio * 100) < 80 ? flippedAspectRatio * 80 : 100);
        setImageWidth((aspectRatio * 100) < 80 ? 80 : (aspectRatio * 100));
        return
      }
      setImageWidth(100)
      setImageHeight((flippedAspectRatio * 100));
      return
    } 
    if (aspectRatio > 1) {
      if (!imageFitHeight) {
        if (imageFlipped) {
          const imageWidth = 80;
          setImageWidth(aspectRatio * 80);
          setImageHeight(imageWidth);
          setPointerY(10);
          setImageY(10);
          setPointerX((100 - (aspectRatio * 80)) / 2);
          setImageX((100 - (aspectRatio * 80)) / 2)
          setOriginPointX(50);
          setLastOriginX(50);
          setOriginPointY(50);
          setLastOriginY(50);
          return
        }
        let percent;
        if (flippedAspectRatio * 100 < 52.356) {
          percent = (((shortestImageRatio * 100) - 100) / 4);
          setPointerX((((aspectRatio * 52.356) - 100) / 2) * -1);
          setImageX((((aspectRatio * 52.356) - 100) / 2) * -1);
          setPointerY(percent);
          setImageY(percent);
        } else {
          percent = (((flippedAspectRatio * 100) - 100) / 2) * -1;
          setPointerX(0);
          setImageX(0);
          setPointerY(percent);
          setImageY(percent);
        }
        setImageWidth((flippedAspectRatio * 100) < 52.356 ? aspectRatio * 52.356 : 100);
        setImageHeight((flippedAspectRatio * 100) < 52.356 ? 52.356 : (flippedAspectRatio * 100));
        return
      }
      setImageWidth((aspectRatio * 100));
      setImageHeight(100)
    }
  }

  const imageLoad = () => {
    if (aspectRatio < 1) {
      setImageWidth(100)
      setImageHeight((flippedAspectRatio * 100));
      return
    } 
    if (aspectRatio > 1) {
      setImageWidth((aspectRatio * 100));
      setImageHeight(100)
    }
  }

  const imageRotate = () => {
    setImageDegrees(imageDegrees - 90);
    imageFlipped ? setImageFlipped(false) : setImageFlipped(true);
    if (imageOrientation === 'horizontal-up') {
      setImageOrientation('vertical-up');
    }
    if (imageOrientation === 'vertical-up') {
      setImageOrientation('horizontal-down');
    }
    if (imageOrientation === 'horizontal-down') {
      setImageOrientation('vertical-down');
    }
    if (imageOrientation === 'vertical-down') {
      setImageOrientation('horizontal-up');
    }
  }
  
  const resizeCropFilterImage = (upload) => {
    const img = new Image();
    img.onload = () => {
        canvasCropFilterResize(img, upload)    
    };
    img.src = mobilePhotoUpload;
  }

  function canvasCropFilterResize(img, upload) {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d");

    if (imageFitHeight) {
      canvas.width = 1080;
      canvas.height = 1080;
    }
    if (!imageFitHeight && !imageFlipped && (aspectRatio > 1)) {
      canvas.width = 1080;
      const height = canvas.width * flippedAspectRatio;
      if (height < 565) {
        canvas.height = 565;
      } else {
        canvas.height = canvas.width * flippedAspectRatio;        
      }
    }
    if (!imageFitHeight && !imageFlipped && (aspectRatio < 1)) {
      canvas.width = 1080;
      const height = canvas.width * flippedAspectRatio
      if (height > 1350) {
        canvas.height = 1350
      } else {
        canvas.height = canvas.width * flippedAspectRatio;        
      }
    }
    if (!imageFitHeight && imageFlipped && (aspectRatio > 1)) {
      canvas.width = 1080;
      const height = canvas.width * aspectRatio;
      if (height > 1350) {
        canvas.height = 1350;
      } else {
        canvas.height = canvas.width * aspectRatio;        
      };
    };
    if (!imageFitHeight && imageFlipped && (aspectRatio < 1)) {
      canvas.width = 1080;
      const height = canvas.width * aspectRatio;
      if (height < 565) {
        canvas.height = 565;
      } else {
        canvas.height = canvas.width * aspectRatio;
      };
    };

    ctx.globalCompositeOperation = 'destination-under';
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const ratio = img.width / img.height;
    let newWidth = canvas.width;
    let newHeight = newWidth / ratio;
    if (!imageFitHeight && imageFlipped && (aspectRatio < 1)) {
      newHeight = canvas.width;
      newWidth = canvas.width * ratio;    
    }
    if (newHeight < canvas.height) {
      if (imageFlipped && (aspectRatio > 1)) {
        newHeight = canvas.width;
        newWidth = canvas.width * ratio;    
      }    
      if (!imageFlipped) {
        newHeight = canvas.height;
        newWidth = newHeight * ratio;        
      }
    }

    let xOffset;
    let yOffset;
    if (imageFitHeight) {
      xOffset = (newHeight * (pointerX / 100));
      yOffset = (newWidth * (pointerY / 100));   
    }   
    if (!imageFitHeight && (aspectRatio > 1)) {
      xOffset = newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0;
      yOffset = newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
    }
    if (!imageFitHeight && (aspectRatio < 1)) {
      xOffset = newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0;
      yOffset = newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
    }
    if (!imageFitHeight && imageFlipped && (aspectRatio > 1)) {
      xOffset = (canvas.height - newWidth) / 2;
      yOffset = newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
    }
    if (!imageFitHeight && imageFlipped && (aspectRatio < 1)) {
      xOffset = (canvas.height - newWidth) / 2;
      yOffset = newHeight > canvas.width ? (canvas.height - newHeight) / 2 : 0;
    }
    switch (true) {
      case imageOrientation === 'vertical-up':
        if (!imageFitHeight) {
          ctx.translate(0, canvas.height);
        } else {
          ctx.translate(0, canvas.width);
        };
        break;
      case imageOrientation === 'horizontal-down':
        if (!imageFitHeight) {
          if (newWidth > canvas.width) {
            ctx.translate(newWidth - (newWidth - canvas.width), newHeight);
          } else if (newHeight > canvas.height) {
            ctx.translate(newWidth, newHeight - (newHeight - canvas.height))
          } else {
            ctx.translate(newWidth, newHeight);
          };
        };
        if (imageFitHeight) {
          ctx.translate(canvas.height, canvas.width);
        }
        break;
      case imageOrientation === 'vertical-down':
        if (!imageFitHeight) {
          ctx.translate(canvas.width, 0);
        } else {
          ctx.translate(canvas.height, 0);
        }
        break;
      default: 
    }
    switch (true) {
      case selectedFilter === 'moon':
        ctx.filter = 'grayscale(100%) brightness(125%)';
        break;
      case selectedFilter === 'clarendon':
        ctx.filter = 'saturate(130%) brightness(115%) contrast(120%) hue-rotate(5deg)';
        break;
      case selectedFilter === 'gingham':
        ctx.filter = 'contrast(75%) saturate(90%) brightness(115%)'
        break;
      case selectedFilter === 'lark':
        ctx.filter = 'saturate(115%) brightness(110%) hue-rotate(5deg)';
        break;
      case selectedFilter === 'reyes':
        ctx.filter = 'contrast(50%) saturate(75%) brightness(125%) hue-rotate(355deg)';
        break;
      case selectedFilter === 'juno':
        ctx.filter = 'contrast(90%) hue-rotate(10deg) brightness(110%)';
        break;
      case selectedFilter === 'slumber':
        ctx.filter = 'brightness(80%) hue-rotate(350deg) saturate(125%)';
        break;
      case selectedFilter === 'crema':
        ctx.filter = 'brightness(85%) hue-rotate(5deg) saturate(90%)';
        break;
      case selectedFilter === 'ludwig':
        ctx.filter = 'hue-rotate(355deg) saturate(125%)';
        break;
      case selectedFilter === 'aden':
        ctx.filter = 'sepia(50%) saturate(150%)';
        break;
      case selectedFilter === 'perpetua':
        ctx.filter = 'brightness(80%) saturate(130%)';
        break;
      default: 
    }

    ctx.rotate(imageDegrees * Math.PI / 180);
    ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
    
    if (upload) {
      canvas.toBlob((blob) => {
        const image = new Image();
        image.src = blob;
        console.log(blob);
        setEditedPhoto(blob);
      });      
    }
  }

  const filterToggle = (event) => {
    const { id } = event.target;
    setSelectedFilter(id);
  }

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
      setPhotoUploadOpen(true);
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
        {(userLoggedIn && isMobile && !photoUploadOpen) &&
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
                  userData={userData}
                />
              } />
              <Route path='/create/style' element={
                <UploadPhotoMobile
                  filterScrollLeft={filterScrollLeft}
                  setFilterScrollLeft={setFilterScrollLeft}
                  selectedFilter={selectedFilter}
                  pointerStart={pointerStart}
                  pointerX={pointerX}
                  pointerY={pointerY}
                  imageWidth={imageWidth}
                  imageHeight={imageHeight}
                  imageDegrees={imageDegrees}
                  originPointX={originPointX}
                  originPointY={originPointY}
                  imageFitHeight={imageFitHeight}
                  imageFlipped={imageFlipped}
                  canvasRef={canvasRef}
                  pointerTracker={pointerTracker}
                  imageLocationHandler={imageLocationHandler}
                  verticalImageHandler={verticalImageHandler}
                  centerImage={centerImage}
                  toggleImageFit={toggleImageFit}
                  verticalToggleFit={verticalToggleFit}
                  imageHandler={imageHandler}
                  imageLoad={imageLoad}
                  imageRotate={imageRotate}
                  resizeCropFilterImage={resizeCropFilterImage}
                  filterToggle={filterToggle}
                  setPhotoUploadOpen={setPhotoUploadOpen} 
                  flippedAspectRatio={flippedAspectRatio} 
                  aspectRatio={aspectRatio} 
                  mobilePhotoUpload={mobilePhotoUpload} 
                  setMobilePhotoUpload={setMobilePhotoUpload}
                />
              } />
              <Route path='/create/details' element={ 
                <UploadPhotoMobileDetails
                  showNotification={showNotification}
                  photoUploadText={photoUploadText}
                  photoUploadTextHandler={photoUploadTextHandler}
                  resizeCropFilterImage={resizeCropFilterImage}
                  canvasRef={canvasRef}
                  setPhotoUploadOpen={setPhotoUploadOpen}
                  editedPhoto={editedPhoto}
                  userData={userData}
                  profilePhotoURL={profilePhotoURL} 
                />
              } />            
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