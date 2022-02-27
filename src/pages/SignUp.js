import "./SignUp.css";
import React, { useEffect, useState } from "react";

const SignUp = () => {
  const [emailValue, setEmailValue] = useState('');
  const [emailValidity, setEmailValidity] = useState('');
  const [fullNameValue, setFullNameValue] = useState('');
  const [fullNameValidity, setFullNameValidity] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  const [usernameValidity, setUsernameValidity] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordValidity, setPasswordValidity] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [signUpDisabled, setSignUpDisabled] = useState(true);

  const togglePasswordVisability = (event) => {
    event.preventDefault();
    passwordHidden ? setPasswordHidden(false) : setPasswordHidden(true);
  }
  
  useEffect(() => {
      (emailValue !== '' && usernameValue !== '' && passwordValue.length > 5) 
    ? setSignUpDisabled(false)
    : setSignUpDisabled(true);
  }, [emailValue, usernameValue, passwordValue]);

  const inputHandler = (event) => {
    const { value, name } = event.target;
    if (name === 'email') {
      setEmailValue(value);
    }
    if (name === 'fullName') {
      setFullNameValue(value);
    }
    if (name === 'username') {
      setUsernameValue(value);
    }
    if (name === 'password') {
      setPasswordValue(value);
    }
  }

  const focusInput = (event) => {
    const { name } = event.target;
    if (name === 'email') {
      setEmailValidity('');
    }
    if (name === 'fullName') {
      setFullNameValidity('');
    }
    if (name === 'username') {
      setUsernameValidity('');
    }
    if (name === 'password') {
      setPasswordValidity('');
    }
    event.target.parentElement.parentElement.classList.toggle('focused')
  }

  const inputBlur = (event) => {
    const { name } = event.target;
    event.target.parentElement.parentElement.classList.toggle('focused')
    if (name === 'email') {
      setEmailValidity(event.target.checkValidity());
      if (emailValue === '') {
        setEmailValidity(false);
      };      
    }
    if (name === 'fullName') {
      if (fullNameValue === '') {
        setFullNameValidity(false);
      } else {
        setFullNameValidity(true);
      };
    };
    if (name === 'username') {
      if (usernameValue === '') {
        setUsernameValidity(false);
      } else {
        setUsernameValidity(true);
      };
    };
    if (name === 'password') {
      if (passwordValue.length < 5) {
        setPasswordValidity(false);
      } else {
        setPasswordValidity(true);
      }
    }
  }

  return (
    <main className="main-wrapper">
      <article className="sign-in-content">
        <div className="sign-in-sign-up-wrapper">
          <div className="sign-in-form-wrapper">
            <h1 className="sign-in-logo">
              Instagram
            </h1>
            <h2 className="sign-up-header">Sign up to see photos and videos from your friends.</h2>
            <button className="facebook-button sign-up">
              <span className="facebook-sprite"></span>
              <span className="facebook-text" >Log in with Facebook</span>
            </button>            
            <div className="or-seperator">
              <div className="line1"></div>
              <div className="or-text">or</div>
              <div className="line2"></div>
            </div>
            <form className="sign-in-form sign-up">
              <div className="username-input-wrapper">
                <label className="log-in-label">
                  <span className={emailValue !== '' ? ["username-placeholder", 'move-label'].join(' ') : 'username-placeholder'}>Email</span>
                  <input 
                    aria-label="Email" 
                    aria-required={true} 
                    autoCapitalize='off' 
                    autoCorrect="off"  
                    name='email' 
                    type='email' 
                    className={emailValue !== '' ? ["email-input", 'text-adjust'].join(' ') : 'email-input'}
                    onChange={inputHandler}
                    onFocus={focusInput}
                    onBlur={inputBlur}
                  />
                </label>
                <div className="username-spacer">
                  {emailValidity === false &&
                    <span className="input-sprite error"></span>
                  }
                  {emailValidity === true && 
                    <span className="input-sprite valid"></span>
                  }  
                </div>                
              </div>
              <div className="username-input-wrapper">
                <label className="log-in-label">
                  <span className={fullNameValue !== '' ? ["username-placeholder", 'move-label'].join(' ') : 'username-placeholder'}>Full Name</span>
                  <input 
                    aria-label="Full Name" 
                    aria-required={true} 
                    autoCapitalize="sentences"
                    autoCorrect="off"
                    name="fullName"
                    type="text"
                    className={fullNameValue !== '' ? ["full-name-input", 'text-adjust'].join(' ') : 'full-name-input'}
                    onChange={inputHandler}
                    onFocus={focusInput}
                    onBlur={inputBlur} 
                  />
                </label>
                <div className="username-spacer">
                  {fullNameValidity === false &&
                    <span className="input-sprite error"></span>
                  }
                  {fullNameValidity === true && 
                    <span className="input-sprite valid"></span>
                  } 
                </div>
              </div>
              <div className="username-input-wrapper">
                <label className="log-in-label">
                  <span className={usernameValue !== '' ? ["username-placeholder", 'move-label'].join(' ') : 'username-placeholder'}>Username</span>
                  <input 
                    aria-label="Username" 
                    aria-required={true} 
                    autoCapitalize="sentences"
                    autoCorrect="off"
                    name="username"
                    type="text"
                    className={usernameValue !== '' ? ["username-input", 'text-adjust'].join(' ') : 'username-input'}
                    onChange={inputHandler}
                    onFocus={focusInput}
                    onBlur={inputBlur} 
                  />
                </label>
                <div className="username-spacer">
                  {usernameValidity === false &&
                    <span className="input-sprite error"></span>
                  }
                  {usernameValidity === true && 
                    <span className="input-sprite valid"></span>
                  } 
                </div>
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
                    onChange={inputHandler}
                    onFocus={focusInput}
                    onBlur={inputBlur} 
                  />
                </label>
                <div className="username-spacer">
                  {passwordValidity === false &&
                    <span className="input-sprite error"></span>
                  }
                  {passwordValidity === true && 
                    <span className="input-sprite valid"></span>
                  }
                  {passwordValue !== '' &&
                    <button className="password-show-button" onClick={togglePasswordVisability}>{passwordHidden ? 'Show' : 'Hide'}</button>                  
                  }
                </div>
              </div>
              <button className="log-in-button" disabled={signUpDisabled}>Sign Up</button>
              <p className="terms-text">By signing up, you agree to our Terms , Data Policy and Cookies Policy .</p>
            </form>         
          </div>
          <div className="sign-up-wrapper">
            <div className="sign-up-text">Have an account? <a className="sign-up-link" href="/">Log In</a></div>
          </div>          
        </div>
      </article>
    </main>
  )
};

export default SignUp;