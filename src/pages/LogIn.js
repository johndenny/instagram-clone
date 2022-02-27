import React, { useEffect, useState } from "react";
import './LogIn.css'
import { initializeApp } from "firebase/app";
import screenshot1 from "../images/screenshots/screenshot1.jpg";
import screenshot2 from "../images/screenshots/screenshot2.jpg";
import screenshot3 from "../images/screenshots/screenshot3.jpg";
import screenshot4 from "../images/screenshots/screenshot4.jpg";
import screenshot5 from "../images/screenshots/screenshot5.jpg";
import { Link } from "react-router-dom";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6fxJ10wIGXPvPxZ3n382SgURWu95ki8Y",
  authDomain: "instagram-clone-9e468.firebaseapp.com",
  projectId: "instagram-clone-9e468",
  storageBucket: "instagram-clone-9e468.appspot.com",
  messagingSenderId: "295610472872",
  appId: "1:295610472872:web:e45f3069bfe5ed3df1e59d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const LogIn = () => {
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [logInDisabled, setLogInDisabled] = useState(true);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [screenshot1Class, setScreenshot1Class] = useState(['screenshot-image']);
  const [screenshot2Class, setScreenshot2Class] = useState(['screenshot-image']);
  const [screenshot3Class, setScreenshot3Class] = useState(['screenshot-image']);
  const [screenshot4Class, setScreenshot4Class] = useState(['screenshot-image']);
  const [screenshot5Class, setScreenshot5Class] = useState(['screenshot-image']);

  const usernameHandler = (event) => {
    const { value } = event.target;
    setUsernameValue(value);
  };

  const passwordHandler = (event) => {
    const { value } = event.target;
    setPasswordValue(value);
  };

  useEffect(() => {
    (passwordValue.length > 5 && usernameValue !== '') ? setLogInDisabled(false) : setLogInDisabled(true);
  }, [usernameValue, passwordValue]);

  const togglePasswordVisability = (event) => {
    event.preventDefault();
    passwordHidden ? setPasswordHidden(false) : setPasswordHidden(true);
  }

  useEffect(() => {
    if (currentSlide === 1) {
      setScreenshot5Class(['screenshot-image', 'last-image']);
      setScreenshot1Class(['screenshot-image', 'current-image']);
      setScreenshot4Class(['screenshot-image']);
    }
    if (currentSlide === 2) {
      setScreenshot1Class(['screenshot-image', 'last-image']);
      setScreenshot2Class(['screenshot-image', 'current-image']);
      setScreenshot5Class(['screenshot-image']);
    }
    if (currentSlide === 3) {
      setScreenshot2Class(['screenshot-image', 'last-image']);
      setScreenshot3Class(['screenshot-image', 'current-image']);
      setScreenshot1Class(['screenshot-image']);
    }
    if (currentSlide === 4) {
      setScreenshot3Class(['screenshot-image', 'last-image']);
      setScreenshot4Class(['screenshot-image', 'current-image']);
      setScreenshot2Class(['screenshot-image']);
    }
    if (currentSlide === 5) {
      setScreenshot4Class(['screenshot-image', 'last-image']);
      setScreenshot5Class(['screenshot-image', 'current-image']);
      setScreenshot3Class(['screenshot-image']);
    }
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      currentSlide === 5 ? setCurrentSlide(1) : setCurrentSlide(currentSlide + 1);
    }, 5000);
    return () => clearInterval(interval)
  }, [currentSlide]);

  const focusInput = (event) => {
    event.target.parentElement.parentElement.classList.toggle('focused')
  }

  return (
    <main className="main-wrapper">
      <article className="sign-in-content">
        <div className="sign-in-image-wrapper">
          <div className="screenshots-wrapper">
            <img alt='' className={screenshot1Class.join(' ')} src={screenshot1}/>
            <img alt='' className={screenshot2Class.join(' ')} src={screenshot2}/>
            <img alt='' className={screenshot3Class.join(' ')} src={screenshot3}/>
            <img alt='' className={screenshot4Class.join(' ')} src={screenshot4}/>
            <img alt='' className={screenshot5Class.join(' ')} src={screenshot5}/>
          </div>
        </div>
        <div className="sign-in-sign-up-wrapper">
          <div className="sign-in-form-wrapper">
            <h1 className="sign-in-logo">
              Instagram
            </h1>
            <form className="sign-in-form">
              <div className="username-input-wrapper">
                <label className="log-in-label">
                  <span className={usernameValue !== '' ? ["username-placeholder", 'move-label'].join(' ') : 'username-placeholder'}>Username</span>
                  <input 
                    aria-label="Username" 
                    aria-required={true} 
                    autoCapitalize='off' 
                    autoCorrect="off" 
                    maxLength='75' 
                    name='username' 
                    type='text' 
                    className={usernameValue !== '' ? ["username-input", 'text-adjust'].join(' ') : 'username-input'}
                    onChange={usernameHandler}
                    onFocus={focusInput}
                    onBlur={focusInput}
                  />
                </label>
                <div className="username-spacer"></div>                
              </div>
              <div className="username-input-wrapper">
                <label className="log-in-label">
                  <span className={passwordValue !== '' ? ["username-placeholder", 'move-label'].join(' ') : 'username-placeholder'}>Password</span>
                  <input 
                    aria-label="Password" 
                    aria-required={true} 
                    autoCapitalize="off"
                    autoCorrect="off"
                    name="password"
                    type={passwordHidden ? "password" : "text"}
                    className={passwordValue !== '' ? ["password-input", 'text-adjust'].join(' ') : 'password-input'}
                    onChange={passwordHandler}
                    onFocus={focusInput}
                    onBlur={focusInput} 
                  />
                </label>
                <div className="username-spacer">
                  {passwordValue !== '' &&
                    <button className="password-show-button" onClick={togglePasswordVisability}>{passwordHidden ? 'Show' : 'Hide'}</button>                  
                  }
                </div>
              </div>

              <button className="log-in-button" disabled={logInDisabled}>Log In</button>
            </form>
            <div className="or-seperator">
              <div className="line1"></div>
              <div className="or-text">or</div>
              <div className="line2"></div>
            </div>
            <button className="facebook-button">
              <span className="facebook-sprite"></span>
              <span className="facebook-text" >Log in with Facebook</span>
            </button>
            <a className="forgot-button" href="/">Forgot password?</a>          
          </div>
          <div className="sign-up-wrapper">
            <div className="sign-up-text">Don't have an account? <Link to="accounts/emailsignup" className="sign-up-link" href="/">Sign Up</Link></div>
          </div>          
        </div>
      </article>
    </main>
  )
}

export default LogIn;