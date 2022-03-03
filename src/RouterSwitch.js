import './RouterSwitch.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import firebaseApp from "./Firebase"; 
import { getAuth, onAuthStateChanged} from "firebase/auth";
import NavigationBar from "./components/NavigationBar";
import Inbox from "./pages/Inbox";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import defaultProfileImage from "./images/default-profile-image.jpg";

const auth = getAuth(firebaseApp);

const RouterSwitch = () => {
  const [userLoggedIn, setUserLoggedIn] = useState('');
  const [userData, setUserData] = useState({});
  const [profilePhotoURL, setProfilePhotoURL] = useState('');

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

  useEffect(() => {
    getProfilePhotoURL();
  }, []);

  return (
    <BrowserRouter>
      <section className="entire-wrapper">
        {userLoggedIn &&
          <NavigationBar getProfilePhotoURL={getProfilePhotoURL} profilePhotoURL={profilePhotoURL} userData={userData}/>
        }
        <Routes>
          {userLoggedIn === '' &&
            <React.Fragment>
              <Route path='/' element={<div></div>} />
              <Route path='/accounts/emailsignup/' element={<div></div>} />            
            </React.Fragment>
          }
          {!userLoggedIn &&
            <React.Fragment>
              <Route path='/' element={<LogIn />} />
              <Route path='/accounts/emailsignup/' element={<SignUp />} />
            </React.Fragment>
          }
          {userLoggedIn &&
            <React.Fragment>
              <Route path='/' element={<Homepage/>} />
              <Route path='/direct/inbox/' element={<Inbox />} />
              <Route path='/explore/' element={<Explore />} />
              <Route path='/explore/' element={<Explore />} />            
            </React.Fragment>
          }
          <Route path='/:username' element={<Profile getProfilePhotoURL={getProfilePhotoURL} profilePhotoURL={profilePhotoURL} userData={userData}/>} />
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default RouterSwitch;