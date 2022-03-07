import { Link, useLocation, useParams } from "react-router-dom";
import "./MobileNavigationBars.css";
import instagramLogo from "../images/mobile-logo.png";
import defaultProfileImage from "../images/default-profile-image.jpg";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MobileNavigationBars = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState('');
  const {
    toggleTopNavigation,
    hideTopNavigation, 
    userData, 
    getProfilePhotoURL, 
    profilePhotoURL,
  } = props;

  const goBack = () => {
    navigate(-1);
  }

  const topNavigationHandler = () => {
    const { pathname } = location;
    const newPathname = pathname.replace(/\//g, '');
    console.log(newPathname);
    console.log(newPathname === userData.displayName);
    if (location.pathname === '/') {
      return (
        <header className="mobile-navigation-header">
          <div className="mobile-navigation-icon-wrapper">
            <button className="add-photo-button">
              <svg aria-label="New Story" className="add-photo-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                <circle cx="12" cy="13.191" fill="none" r="4.539" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></circle>
                <path d="M18.592 21.374A3.408 3.408 0 0022 17.966V8.874a3.41 3.41 0 00-3.41-3.409h-.52a2.108 2.108 0 01-1.954-1.375 2.082 2.082 0 00-2.204-1.348h-3.824A2.082 2.082 0 007.884 4.09 2.108 2.108 0 015.93 5.465h-.52A3.41 3.41 0 002 8.875v9.091a3.408 3.408 0 003.408 3.408z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            <h1 className="logo-header">
              <div className="logo-header-wrapper">
                <Link to="/" className="logo-header-link">
                  <img alt='' src={instagramLogo} />
                </Link>                
              </div>
            </h1>
            <div className="message-icon-wrapper">
              <Link to="/direct/inbox/" className="messages-link">
                <svg aria-label="Direct" className="messages-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                  <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                  <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                </svg>
              </Link>
            </div>            
          </div>
        </header>   
      )
    }
    if (location.pathname === '/explore/') {
      return (
        <header className="mobile-navigation-header">
          <div className="mobile-explore-search-wrapper">
            <input className="mobile-explore-search-input"/>
          </div>
        </header>   
      )
    }
    if (location.pathname === '/accounts/edit/') {
      return (
        <header className="mobile-navigation-header">
          <div className="mobile-navigation-icon-wrapper">
            <button className="back-button" onClick={goBack}>
              <svg aria-label="Back" className="back-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M21 17.502a.997.997 0 01-.707-.293L12 8.913l-8.293 8.296a1 1 0 11-1.414-1.414l9-9.004a1.03 1.03 0 011.414 0l9 9.004A1 1 0 0121 17.502z"></path>
              </svg>
            </button>
            <h1 className="logo-header">
              Edit Profile
            </h1>
            <div className="message-icon-wrapper">
            </div>            
          </div>
        </header>   
      )
    }
    if (hideTopNavigation) {
      return (
        ''
      )
    }
    if (userData.displayName === newPathname) {
      return (
        <header className="mobile-navigation-header">
          <div className="mobile-navigation-icon-wrapper">
            <button className="setting-quick-links-button">
              <svg aria-label="Options" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                <circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                <path d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            <h1 className="logo-header">
              {newPathname}
            </h1>
            <div className="discover-people-icon-wrapper">
              <svg aria-label="Discover People" className="discover-people-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 48 48" width="24">
                <path d="M32 25.5c5.2 0 9.5-4.3 9.5-9.5S37.2 6.5 32 6.5s-9.5 4.3-9.5 9.5 4.3 9.5 9.5 9.5zm0-16c3.6 0 6.5 2.9 6.5 6.5s-2.9 6.5-6.5 6.5-6.5-2.9-6.5-6.5 2.9-6.5 6.5-6.5zm5.5 19h-11c-5.5 0-10 4.5-10 10V40c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-1.5c0-3.9 3.1-7 7-7h11c3.9 0 7 3.1 7 7V40c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-1.5c0-5.5-4.5-10-10-10zm-20-4.5c0-.8-.7-1.5-1.5-1.5h-5.5V17c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v5.5H2c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5h5.5V31c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-5.5H16c.8 0 1.5-.7 1.5-1.5z"></path>
              </svg>
            </div>            
          </div>
        </header>   
      )
    }
    return (
      <header className="mobile-navigation-header">
        <div className="mobile-navigation-icon-wrapper">
          <button className="back-button" onClick={goBack}>
            <svg aria-label="Back" className="back-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
              <path d="M21 17.502a.997.997 0 01-.707-.293L12 8.913l-8.293 8.296a1 1 0 11-1.414-1.414l9-9.004a1.03 1.03 0 011.414 0l9 9.004A1 1 0 0121 17.502z"></path>
            </svg>
          </button>
          <h1 className="logo-header">
            {newPathname}
          </h1>
          <div className="message-icon-wrapper">
          </div>            
        </div>
      </header> 
    )
  }
  
  useEffect(() => {
    toggleTopNavigation(false);
    console.log(location, params)
    setCurrentPath(location.pathname);
  },[location]);

  useEffect(() => {
    getProfilePhotoURL();
  },[]);

  return (
    <React.Fragment>
      <nav className="mobile-navigation-top-wrapper">
        <div className='mobile-navigation-bar-spacer'></div>
        {topNavigationHandler()}
      </nav>
      <nav className="mobile-bottom-navigation">
        <div className="bottom-navigation-icon-wrapper">
          <Link to='/' className="mobile-home-link icon">
            {currentPath === '/'
              ? <svg aria-label="Home" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                  <path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 01.31.724V22a1 1 0 01-1 1z">
                  </path>
                </svg>
              : <svg aria-label="Home" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                  <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2">
                  </path>
                </svg>  
            }              
          </Link>
          <Link to='/explore/' className="mobile-explore-link icon">
            {currentPath === '/explore/'
              ? <svg aria-label="Search &amp; Explore" className="explore-svg-selected" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 48 48" width="24">
                  <path d="M47.6 44L35.8 32.2C38.4 28.9 40 24.6 40 20 40 9 31 0 20 0S0 9 0 20s9 20 20 20c4.6 0 8.9-1.6 12.2-4.2L44 47.6c.6.6 1.5.6 2.1 0l1.4-1.4c.6-.6.6-1.6.1-2.2zM20 35c-8.3 0-15-6.7-15-15S11.7 5 20 5s15 6.7 15 15-6.7 15-15 15z"></path>
                </svg>
              : <svg aria-label="Search &amp; Explore" className="explore-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                  <path d="M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
                </svg>
            }
          </Link>
          <div className="add-photo-bottom-button icon">
            <svg aria-label="New Post" className="add-photo-bottom-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
              <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
            </svg>
          </div>
          <div className='activity-icon icon'>
              <svg aria-label="Activity Feed" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
              </svg>
              {/* <svg aria-label="Activity Feed" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 48 48" width="24">
                <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
              </svg> */}
            </div>
            <Link to={`/${userData.displayName}/`} className='profile-picture icon'>
              {currentPath === `/${userData.displayName}/` &&
                <div className='profile-ring'></div>
              }
              <div className='profile-picture-wrapper'>
                {profilePhotoURL === null
                  ? <img alt='' src={defaultProfileImage}/>
                  : <img alt='' src={profilePhotoURL} />
                }
              </div>
            </Link> 
        </div>
      </nav>      
    </React.Fragment>

  )
}

export default MobileNavigationBars;