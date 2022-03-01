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

const auth = getAuth(firebaseApp);

const RouterSwitch = () => {
  const [userLoggedIn, setUserLoggedIn] = useState('');

  const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(user);
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

  return (
    <BrowserRouter>
      {userLoggedIn &&
        <NavigationBar />
      }
      <Routes>
        {userLoggedIn === '' &&
          <Route path='/' element={<div></div>} />
        }
        {userLoggedIn
          ? <Route path='/' element={<Homepage/>} />
          : <Route path='/' element={<LogIn />} />
        }
        {userLoggedIn &&
          <React.Fragment>
            <Route path='/direct/inbox/' element={<Inbox />} />
            <Route path='/explore/' element={<Explore />} />            
          </React.Fragment>
        }
        <Route path='/accounts/emailsignup/' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterSwitch;