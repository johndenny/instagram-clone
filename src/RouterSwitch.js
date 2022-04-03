import './RouterSwitch.css';
import MobileNavigationBars from './components/MobileNavigationBars.js'
import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Route, Routes, Link, useParams, } from "react-router-dom";
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
import { getFirestore, setDoc, doc, getDoc, query, collection, where, getDocs, orderBy, arrayUnion, updateDoc, arrayRemove } from 'firebase/firestore';
import UploadPhotoMobile from './pages/UploadPhotoMobile';
import UploadPhotoMobileDetails from './pages/UploadPhotoMobileDetails';
import UploadPhotoModal from './components/UploadPhotoModal';
import PostLinksModal from './components/PostLinksModal';
import MobilePhotoPost from './pages/MobilePhotoPost';
import MobileComments from './pages/MobileComments';
import { v4 as uuidv4 } from 'uuid';
import LikedBy from './pages/LikedBy';

const auth = getAuth();
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
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [currentUsersPage, setCurrentUsersPage] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [profileImages, setProfileImages] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [profileUsername, setProfileUsername] = useState('');
  const [profileNavigate, setProfileNavigate] = useState('');
  const [usernameLink, setUsernameLink] = useState('');
  const [isPostLinksOpen, setIsPostLinkOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState('');

  // Profile Upload //

  const [profilePhotoURL, setProfilePhotoURL] = useState('');
  const [profileUpload, setProfileUpload] = useState('');
  const profileImageRef = ref(storage, `profilePhotos/${userData.uid}.jpg`);
  const [profilePhotoModal, setProfilePhotoModal] = useState(false);
  const [isProfilePhotoUploading, setIsProfilePhotoUploading] = useState(false);

  // DESKTOP IMAGE UPLOAD //

  const [photoUploadModalOpen, setPhotoUploadModalOpen] = useState(false);

  // MOBILE IMAGE UPLOAD //

  const [aspectRatio, setAspectRatio] = useState('');
  const [flippedAspectRatio, setFlippedAspectRatio] = useState('');
  const [mobilePhotoUpload, setMobilePhotoUpload] = useState('');
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false);
  const [editedPhoto, setEditedPhoto] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState('');
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

  // POSTS //

  const likeUploadToggle = async (postID) => {
    const {
      photoURL,
      uid,
      displayName,
      fullname
    } = userData;
    const postRef = doc(db, 'postUploads', postID);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const { likes } = postSnap.data();
      const likeIndex = likes.findIndex((like) => like.uid === uid)
      if (likeIndex === -1) {
        await updateDoc(postRef, {
          likes: arrayUnion({
            likeID: uuidv4(),
            photoURL: photoURL,
            uid: uid,
            uploadDate: Date.now(),
            username: displayName,
            fullName: fullname
          })
        });          
      } else {
        await updateDoc(postRef, {
          likes: arrayRemove(likes[likeIndex])
        });        
      }
    }
  };

  const postLinksModalHandler = (index) => {
    if (isPostLinksOpen) {
    setIsPostLinkOpen(false);
    setSelectedPost('');
    } else {
    setIsPostLinkOpen(true);
    setSelectedPost(photosArray[index])     
    };
  };
  
  useEffect(() => {
    console.log(selectedPost);
  },[selectedPost]);

  const getPostData = async (postID) => {
    setIsLoadingPage(true);
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
  };

  useEffect(() => {
    console.log(selectedPost);
  }, [selectedPost])

  // PROFILE //

  const [photosArray, setPhotosArray] = useState([]);

  // MOBILE IMAGE UPLOAD //

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
      setMobilePhotoUpload('');
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
  }, [imageX, imageY, selectedFilter, imageDegrees, imageFitHeight]);

  useEffect(() => {
    createThumbnailImage();
  }, [editedPhoto]);

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

  const createThumbnailImage = () => {
    if (editedPhoto !== '') {
      const img = new Image();
      img.onload = () => {
        canvasThumbnail(img)
      }; 
      img.src = URL.createObjectURL(editedPhoto);
    }
  }

  function canvasThumbnail(img) {
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
      console.log('thumbnail:', blob);
      setThumbnailImage(blob)
    });
  }
  
  const resizeCropFilterImage = (upload) => {
    if (mobilePhotoUpload !== '') {
      const img = new Image();
      img.onload = () => {
          canvasCropFilterResize(img, upload)    
      };
      img.src = mobilePhotoUpload;      
    }
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
    setIsProfilePhotoUploading(true);
    await deleteObject(profileImageRef);
    await updateProfile(auth.currentUser, {
      photoURL: ''
    });
    await setDoc(doc(db, 'users', userData.uid), {photoURL: ''}, {merge: true});
    getProfilePhotoURL();
    setIsProfilePhotoUploading(false);
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
    setIsProfilePhotoUploading(true);
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
    setIsProfilePhotoUploading(false);
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

  // SITE WIDE //

  const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(user);
        setUserData(user)
        setUserLoggedIn(true);
        setAuthLoading(false);
        getUserProfileDoc(user);
      }
      else {
        setUserLoggedIn(false);
      }
    });
  };

  const getUserProfileDoc = async (user) => {
    const { uid } = user;
    const profileDataRef = doc(db, 'users', uid);
    const profileDataSnap = await getDoc(profileDataRef);
    if (profileDataSnap.exists()) {
      console.log('success!');
      setUserData({...user,...profileDataSnap.data()});
    }
  }

  useEffect(() => {
    console.log(userData);
  },[userData]);

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

  // const getPhotoURLs = async (document) => {
  //   const { photos } = document
  //   let urlArray = [document];
  //   for (let i = 0; i < photos.length; i++) {
  //     const photoURLs = doc(db, 'photoUploads', photos[i]);
  //     const photoURLSnap = await getDoc(photoURLs);
  //     if (photoURLSnap.exists()) {
  //       urlArray.push(photoURLSnap.data());
  //     }
  //   }
  //   console.log(urlArray);
  //   return urlArray
  // }

  const getPhotoURLs = async (document) => {
    const { postID } = document;
    const photoArray = [document];
    const profilePhotoData = query(collection(db, 'photoUploads'), 
      where('postID', '==', postID), orderBy('index'));
    const profileImageDataSnap = await getDocs(profilePhotoData);
    profileImageDataSnap.forEach((doc) => {
      photoArray.push(doc.data());
    });

    console.log([document, ...photoArray]);
    return photoArray
  }

  useEffect(() => {
    console.log(photosArray);
  }, [photosArray]);

  const getUserProfileData = async (username, page) => {
    console.log('current user:', userData.uid);
    const displayNameRef = doc(db, 'displayNames', username);
    const docSnap = await getDoc(displayNameRef);
    if (docSnap.exists()) {
      const { uid } = docSnap.data();
      let imageArray = [];
      let urlArray = []

      const profileDataRef = doc(db, 'users', uid);
      const profileDataSnap = await getDoc(profileDataRef);
      if (profileDataSnap.exists()) {
        console.log("page:", page);
        if (page === 'feed' || page === 'tagged' || page === undefined) {
          setProfileExists(true);
        } else if (page === 'saved' && uid === userData.uid){
          setProfileExists(true);
        } else {
          setProfileExists(false);
        }
        if (uid === userData.uid) {
          setCurrentUsersPage(true);
        } else {
          setCurrentUsersPage(false);
        };
        setProfileData(profileDataSnap.data());
        setIsLoadingPage(false);
        setDataLoading(false);
      } else {
        console.log('no profile data document')
      }      

      const profileImageData = query(collection(db, 'postUploads'), 
        where('uid', '==', uid), orderBy('uploadDate', 'desc'));
      const profileImageDataSnap = await getDocs(profileImageData);
      profileImageDataSnap.forEach((doc) => {
        imageArray.push(doc.data());
        let newPost = getPhotoURLs(doc.data());
        urlArray.push(newPost);
      });
      console.log(urlArray);
      Promise.all(urlArray).then((values) => {
        setPhotosArray(values);
      })
      setProfileImages(imageArray);
      console.log(imageArray);
      

    } else {
      console.log('no displayName document');
      setProfileExists(false);
      setDataLoading(false);
    }
  };

  useEffect(() => {
    getProfilePhotoURL();
    checkForMobile();
  }, []);

  useEffect(() => {
    console.log('navigate:', profileNavigate);
  }, [profileNavigate]);

  return (
    <BrowserRouter>
      {isPostLinksOpen &&
        <PostLinksModal
          selectedPost={selectedPost}
          setIsPostLinkOpen={setIsPostLinkOpen} 
          postLinksModalHandler={postLinksModalHandler}
        />
      }
      {photoUploadModalOpen &&
        <UploadPhotoModal
          userData={userData}
          setCurrentPath={setCurrentPath}
          setPhotoUploadModalOpen={setPhotoUploadModalOpen} 
        />
      }
      <section className="entire-wrapper">
        {(authLoading || dataLoading) &&
          <div className='loading-placeholder'>
            <svg width="50" height="50" viewBox="0 0 50 50" className='loading-placeholder-svg' fill='#c7c7c7'>
              <path d="M25 1c-6.52 0-7.34.03-9.9.14-2.55.12-4.3.53-5.82 1.12a11.76 11.76 0 0 0-4.25 2.77 11.76 11.76 0 0 0-2.77 4.25c-.6 1.52-1 3.27-1.12 5.82C1.03 17.66 1 18.48 1 25c0 6.5.03 7.33.14 9.88.12 2.56.53 4.3 1.12 5.83a11.76 11.76 0 0 0 2.77 4.25 11.76 11.76 0 0 0 4.25 2.77c1.52.59 3.27 1 5.82 1.11 2.56.12 3.38.14 9.9.14 6.5 0 7.33-.02 9.88-.14 2.56-.12 4.3-.52 5.83-1.11a11.76 11.76 0 0 0 4.25-2.77 11.76 11.76 0 0 0 2.77-4.25c.59-1.53 1-3.27 1.11-5.83.12-2.55.14-3.37.14-9.89 0-6.51-.02-7.33-.14-9.89-.12-2.55-.52-4.3-1.11-5.82a11.76 11.76 0 0 0-2.77-4.25 11.76 11.76 0 0 0-4.25-2.77c-1.53-.6-3.27-1-5.83-1.12A170.2 170.2 0 0 0 25 1zm0 4.32c6.4 0 7.16.03 9.69.14 2.34.11 3.6.5 4.45.83 1.12.43 1.92.95 2.76 1.8a7.43 7.43 0 0 1 1.8 2.75c.32.85.72 2.12.82 4.46.12 2.53.14 3.29.14 9.7 0 6.4-.02 7.16-.14 9.69-.1 2.34-.5 3.6-.82 4.45a7.43 7.43 0 0 1-1.8 2.76 7.43 7.43 0 0 1-2.76 1.8c-.84.32-2.11.72-4.45.82-2.53.12-3.3.14-9.7.14-6.4 0-7.16-.02-9.7-.14-2.33-.1-3.6-.5-4.45-.82a7.43 7.43 0 0 1-2.76-1.8 7.43 7.43 0 0 1-1.8-2.76c-.32-.84-.71-2.11-.82-4.45a166.5 166.5 0 0 1-.14-9.7c0-6.4.03-7.16.14-9.7.11-2.33.5-3.6.83-4.45a7.43 7.43 0 0 1 1.8-2.76 7.43 7.43 0 0 1 2.75-1.8c.85-.32 2.12-.71 4.46-.82 2.53-.11 3.29-.14 9.7-.14zm0 7.35a12.32 12.32 0 1 0 0 24.64 12.32 12.32 0 0 0 0-24.64zM25 33a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm15.68-20.8a2.88 2.88 0 1 0-5.76 0 2.88 2.88 0 0 0 5.76 0z"></path>
            </svg>
          </div>
        }
        {isLoadingPage &&
            <div className='share-post-loading-bar'></div>
        }

        {(userLoggedIn && !isMobile) &&
          <NavigationBar
            currentPath={currentPath} 
            setCurrentPath={setCurrentPath}
            photoUploadModalOpen={photoUploadModalOpen}
            setPhotoUploadModalOpen={setPhotoUploadModalOpen}
            getProfilePhotoURL={getProfilePhotoURL} 
            profilePhotoURL={profilePhotoURL} 
            userData={userData}
          />
            
        }
        {(userLoggedIn && isMobile && !photoUploadOpen) &&
          <MobileNavigationBars
            setProfileNavigate={setProfileNavigate}
            profileNavigate={profileNavigate}
            isLoadingPage={isLoadingPage}
            setIsLoadingPage={setIsLoadingPage}
            profileUsername={profileUsername}
            profileExists={profileExists} 
            getUserProfileData={getUserProfileData}
            profileData={profileData}
            profileImages={profileImages}
            currentUsersPage={currentUsersPage}
            mobilePhotoUploadHandler={mobilePhotoUploadHandler} 
            toggleTopNavigation={toggleTopNavigation} 
            hideTopNavigation={hideTopNavigation} 
            getProfilePhotoURL={getProfilePhotoURL} 
            profilePhotoURL={profilePhotoURL} 
            userData={userData}/>
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
                  thumbnailImage={thumbnailImage}
                  userData={userData}
                  profilePhotoURL={profilePhotoURL} 
                />
              } />            
            </React.Fragment>
          }
          <Route path='/:username' element={
            <Profile
              likeUploadToggle={likeUploadToggle}
              setPhotosArray={setPhotosArray}
              setIsLoadingPage={setIsLoadingPage}
              getPostData={getPostData}
              postLinksModalHandler={postLinksModalHandler}
              photosArray={photosArray}
              setProfileUsername={setProfileUsername}
              isMobile={isMobile}
              setCurrentPath={setCurrentPath}
              setPhotoUploadModalOpen={setPhotoUploadModalOpen}
              isProfilePhotoUploading={isProfilePhotoUploading}
              setDataLoading={setDataLoading}
              getUserProfileData={getUserProfileData}
              profileExists={profileExists}
              setProfileExists={setProfileExists}
              currentUsersPage={currentUsersPage}
              profileData={profileData}
              profileImages={profileImages}
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
          <Route path='/:username/:page' element={
            <Profile
              likeUploadToggle={likeUploadToggle}
              setPhotosArray={setPhotosArray}
              setIsLoadingPage={setIsLoadingPage}
              getPostData={getPostData}
              postLinksModalHandler={postLinksModalHandler}
              photosArray={photosArray}
              setProfileUsername={setProfileUsername}
              isMobile={isMobile}
              setCurrentPath={setCurrentPath}
              setPhotoUploadModalOpen={setPhotoUploadModalOpen}
              isProfilePhotoUploading={isProfilePhotoUploading}
              setDataLoading={setDataLoading}
              getUserProfileData={getUserProfileData}
              setProfileExists={setProfileExists}
              profileExists={profileExists}
              currentUsersPage={currentUsersPage}
              profileData={profileData}
              profileImages={profileImages}
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
          <Route path='/p/:postID' element={
            <MobilePhotoPost
              setIsLoadingPage={setIsLoadingPage}
              likeUploadToggle={likeUploadToggle}
              userData={userData}
              profileData={profileData} 
              setDataLoading={setDataLoading}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
            />} 
          />
          <Route path='/p/:postID/comments' element={
            <MobileComments
              setDataLoading={setDataLoading}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
            />}
          />
          <Route path='/p/:postID/liked_by' element={
            <LikedBy 
              selectedPost={selectedPost}
            />
          } />
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