import defaultProfileImage from "../images/default-profile-image.jpg";
import './Profile.css';
import React, { useEffect, useState } from "react";
import ProfilePhotoModal from "../components/ProfilePhotoModal";
import { Link, useParams, useLocation} from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import firebaseApp from "../Firebase";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import ProfileImagesLoader from "../components/ProfileImagesLoader";

const db = getFirestore(firebaseApp);
const auth = getAuth();

const Profile = (props) => {
  const {
    getPostData,
    photosArray,
    isMobile,
    userData,
    setDataLoading,
    getUserProfileData,
    profileExists,
    setProfileExists,
    currentUsersPage,
    profileData,
    profileImages,
    profilePhotoURL, 
    uploadClick, 
    uploadHandler, 
    removeProfilePhoto, 
    profilePhotoModal, 
    profilePhotoModalToggle,
    isProfilePhotoUploading,
    setCurrentPath,
    setPhotoUploadModalOpen,
    setProfileUsername,
    postLinksModalHandler,
    setIsLoadingPage,
  } = props;
  const [width, height] = useWindowSize();
  const params = useParams();
  const location = useLocation();
  const [pageSelected, setPageSelected] = useState('posts');
  const [previousUsername, setPreviousUsername] = useState('')

  useEffect(() => {
    if (profileData.length === 0 || previousUsername !== params.username) {
      setProfileUsername(params.username);
      console.log('params:', params.username, 'previous username:', previousUsername);
      setDataLoading(true);
      setPreviousUsername(params.username);
      getUserProfileData(params.username, params.page);
    }
    if (params.page === 'feed' || params.page === 'tagged' || params.page === 'saved') {
      setPageSelected(params.page);
    } else if (params.page === undefined){
      setPageSelected('posts');
    };
  }, [userData, location]);

  const openNewPostModal = () => {
    setPhotoUploadModalOpen(true);
    setCurrentPath('');
  }

  useEffect(() => {
    console.log(profileData);
  },[]);

  useEffect(() => {
    console.log(pageSelected)
  }, [pageSelected])

  return (
    <main className="profile-wrapper">
      {profilePhotoModal &&
        <ProfilePhotoModal uploadClick={uploadClick} uploadHandler={uploadHandler} removeProfilePhoto={removeProfilePhoto} profilePhotoModalToggle={profilePhotoModalToggle}/>      
      }
      {profileExists
        ? <div className="profile">
            {width > 736 &&
              <React.Fragment>
                <header className="profile-header">
                  {currentUsersPage
                    ? <div className="profile-image">
                        <button className="profile-image-button" onClick={profilePhotoModalToggle}>
                          <div className={isProfilePhotoUploading ? "profile-photo-spinner" : ["profile-photo-spinner", 'hidden'].join(' ')}>
                            <svg aria-label="Loading..." className='spinner' viewBox="0 0 100 100">
                              <rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim1" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin="0s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim2" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin=".1s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim3" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin=".2s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim4" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin=".3s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim5" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin=".4s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim6" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin=".5s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim7" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin=".6s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim8" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin=".7s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim9" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin=".8s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim10" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin=".9s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim11" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin="1s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                              <rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47">
                                <animate 
                                  id="anim12" 
                                  attributeType="xml"
                                  attributeName="opacity" 
                                  begin="1.1s" 
                                  values="1;0;" 
                                  dur="1.2s"
                                  repeatCount="indefinite" 
                                />
                              </rect>
                            </svg>    
                          </div>
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
                    : <div className="profile-image">
                        <div className="profile-image-wrapper">
                            {profileData.photoURL !== null
                              ? <img alt="" src={profileData.photoURL}/>
                              : <img alt="" src={defaultProfileImage}/>
                            }
                        </div>
                      </div>              
                  }
                  <section className="profile-details">
                    <div className="top-details">
                      <h2 className="displayName">
                        {profileData.username}
                      </h2>
                      {currentUsersPage
                        ? <Link to="/accounts/edit/" className="edit-profile-button-wrapper">
                            <div className="edit-profile-button">
                              Edit Profile
                            </div>
                          </Link>
                        : <div className="follow-profile-button-wrapper">
                            <button className="follow-profile-button">
                              Follow
                            </button>
                          </div>
                      }

                      <div className="settings-quick-links-wrapper">
                        {currentUsersPage && !isMobile &&
                          <button className="setting-quick-links-button">
                              <svg aria-label="Options" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                <circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                                <path d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                              </svg>
                          </button>                        
                        }
                        {!currentUsersPage &&
                          <button className="user-quick-links-button">
                            <svg aria-label="Options" className="_8-yf5 " color="#262626" fill="#262626" height="32" role="img" viewBox="0 0 24 24" width="32">
                              <circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>
                            </svg>
                          </button>                        
                        }
                      </div>
                    </div>
                    <div className="profile-numbers-wrapper">
                      <ul className="profile-numbers-list">
                        <li className="posts-number-wrapper">
                          <div className="posts-wrapper">
                            <span className="posts-made">
                              {photosArray.length}
                            </span>
                            {' posts'}
                          </div>
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
                      <div className="profile-full-name">{profileData.fullname}</div>
                      <div className="profile-bio-text">{profileData.bio}</div>
                      <a href={`http://${profileData.website}`}>{profileData.website}</a>
                    </div>
                  </section>
                </header>
                  <div className="tablist-wrapper">
                  <Link 
                    to={`/${params.username}`}
                    className={
                      pageSelected === "posts" 
                        ? ["profile-tabs", 'selected'].join(' ') 
                        : "profile-tabs"}
                  >
                    <div className="tablist-icon-text-wrapper">
                      <svg aria-label="" className="tablist-svg" color="#8e8e8e" fill="#262626" height="12" role="img" viewBox="0 0 24 24" width="12">
                        <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                      </svg>
                      <span>
                        POSTS
                      </span>
                    </div>
                  </Link>
                  {currentUsersPage &&
                    <Link
                      to={`/${params.username}/saved`} 
                      className={
                        pageSelected === "saved" 
                          ? ["profile-tabs", 'selected'].join(' ') 
                          : "profile-tabs"}
                    >
                      <div className="tablist-icon-text-wrapper">
                        <svg aria-label="" className="tablist-svg" color="#8e8e8e" fill="#8e8e8e" height="12" role="img" viewBox="0 0 24 24" width="12">
                          <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                        </svg>
                        <span>
                          SAVED
                        </span>
                      </div>
                    </Link>                  
                  }
                  <Link 
                    to={`/${params.username}/tagged`}
                    className={
                      pageSelected === "tagged" 
                        ? ["profile-tabs", 'selected'].join(' ') 
                        : "profile-tabs"}
                  >
                    <div className="tablist-icon-text-wrapper">
                      <svg aria-label="" className="tablist-svg" color="#8e8e8e" fill="#8e8e8e" height="12" role="img" viewBox="0 0 24 24" width="12">
                        <path d="M10.201 3.797L12 1.997l1.799 1.8a1.59 1.59 0 001.124.465h5.259A1.818 1.818 0 0122 6.08v14.104a1.818 1.818 0 01-1.818 1.818H3.818A1.818 1.818 0 012 20.184V6.08a1.818 1.818 0 011.818-1.818h5.26a1.59 1.59 0 001.123-.465z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        <path d="M18.598 22.002V21.4a3.949 3.949 0 00-3.948-3.949H9.495A3.949 3.949 0 005.546 21.4v.603" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><circle cx="12.072" cy="11.075" fill="none" r="3.556" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                      </svg>
                      <span>
                        TAGGED
                      </span>
                    </div>
                  </Link>
                </div>             
              </React.Fragment>
            }
            {width <= 736 &&
              <React.Fragment>
                <header className="profile-header">
                {currentUsersPage
                    ? <div className="profile-image">
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
                    : <div className="profile-image">
                        <div className="profile-image-wrapper">
                            {profileData.photoURL !== null
                              ? <img alt="" src={profileData.photoURL}/>
                              : <img alt="" src={defaultProfileImage}/>
                            }
                        </div>
                      </div>              
                  }
                  <section className="profile-details">
                    <div className="top-details">
                      <h2 className="displayName">
                        {profileData.username}
                      </h2>

                      <div className="settings-quick-links-wrapper">
                        {currentUsersPage && !isMobile &&
                          <button className="setting-quick-links-button">
                              <svg aria-label="Options" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                <circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                                <path d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                              </svg>
                          </button>                        
                        }
                        {!currentUsersPage &&
                          <button className="user-quick-links-button">
                            <svg aria-label="Options" className="_8-yf5 " color="#262626" fill="#262626" height="32" role="img" viewBox="0 0 24 24" width="32">
                              <circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>
                            </svg>
                          </button>                        
                        }
                      </div>
                    </div>
                    {currentUsersPage
                      ? <Link to="/accounts/edit/" className="edit-profile-button-wrapper">
                          <div className="edit-profile-button">
                            Edit Profile
                          </div>
                        </Link>
                      : <div className="follow-profile-button-wrapper">
                          <button className="follow-profile-button">
                            Follow
                          </button>
                        </div>
                    }
                  </section>
                </header>
                <div className="profile-text-block">
                  <div className="profile-full-name">{profileData.fullname}</div>
                  <div className="profile-bio-text">{profileData.bio}</div>
                  <a href={profileData.website}>{profileData.website}</a>
                </div>
                <ul className="profile-numbers-list">
                  <li className="posts-number-wrapper">
                    <div className="posts-wrapper">
                      <span className="posts-made">
                        {photosArray.length}
                      </span>
                      {' posts'}
                    </div>
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
                <div className="tablist-wrapper">
                  <Link 
                    to={`/${params.username}`} 
                    className="profile-tabs"
                  >
                    <svg 
                      aria-label="Posts" className="tablist-svg" 
                      color={
                        pageSelected === 'posts' 
                          ? "#0095f6" 
                          : "#8e8e8e"
                      } 
                      fill="#0095f6" 
                      height="24" 
                      role="img" 
                      viewBox="0 0 24 24" 
                      width="24"
                    >
                      <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
                      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                    </svg>
                  </Link>
                  <Link 
                    to={`/${params.username}/feed`} 
                    className="profile-tabs feed">
                      <span 
                        className={pageSelected === 'feed' ? "profile-feed-sprite selected" : "profile-feed-sprite"}
                      ></span>
                  </Link>
                  {currentUsersPage &&
                    <Link to={`/${params.username}/saved`} className="profile-tabs saved">
                      <svg 
                        aria-label="Saved" 
                        className="tablist-svg" 
                        color={pageSelected === 'saved' ? "#0095f6" : "#8e8e8e"} 
                        fill="#8e8e8e" 
                        height="24" 
                        role="img" 
                        viewBox="0 0 24 24" 
                        width="24"
                      >
                        <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                      </svg>
                    </Link>                  
                  }
                  <Link 
                    to={`/${params.username}/tagged`} 
                    className="profile-tabs tagged"
                  >
                  <svg 
                    aria-label="Tagged" 
                    className="tablist-svg" 
                    color={pageSelected === 'tagged' ? "#0095f6" : "#8e8e8e"} 
                    fill="#8e8e8e" 
                    height="24" 
                    role="img" 
                    viewBox="0 0 24 24" 
                    width="24"
                  >
                    <path d="M10.201 3.797L12 1.997l1.799 1.8a1.59 1.59 0 001.124.465h5.259A1.818 1.818 0 0122 6.08v14.104a1.818 1.818 0 01-1.818 1.818H3.818A1.818 1.818 0 012 20.184V6.08a1.818 1.818 0 011.818-1.818h5.26a1.59 1.59 0 001.123-.465z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M18.598 22.002V21.4a3.949 3.949 0 00-3.948-3.949H9.495A3.949 3.949 0 005.546 21.4v.603" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <circle cx="12.072" cy="11.075" fill="none" r="3.556" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  </svg>
                  </Link>
                </div>            
              </React.Fragment>
            }
            <div className="profile-posts">
              {(pageSelected === 'posts' || pageSelected === 'feed') &&
                <ProfileImagesLoader
                  setIsLoadingPage={setIsLoadingPage}
                  getPostData={getPostData}
                  postLinksModalHandler={postLinksModalHandler}
                  isMobile={isMobile}
                  pageSelected={pageSelected}
                  profileData={profileData} 
                  photosArray={photosArray}
                />              
              }
              {currentUsersPage && photosArray.length === 0 && (pageSelected === 'posts' || pageSelected === 'feed') &&
                <article className="no-posts-from-user">
                  <div className="no-posts-content">
                    {isMobile 
                      ? <label htmlFor='mobile-add-photo-input'>
                          <div className="add-first-photo-button">
                            <div className="camera-sprite-first-photo">
                            </div>
                          </div>                 
                        </label>
                      : <button className="add-first-photo-button" onClick={openNewPostModal}>
                          <div className="camera-sprite-first-photo">
                          </div>
                        </button>
                    }
                    <h1 className="share-first-photo-header">
                      Share Photos
                    </h1>
                    <div className="share-first-photo-text">
                      When you share photos, they will appear on your profile.
                    </div>
                    {isMobile
                      ? <label htmlFor='mobile-add-photo-input'>
                          <div className="add-first-photo-text-button" type="button">
                            Share your first photo
                          </div>                      
                        </label>
                      : <button className="add-first-photo-text-button" onClick={openNewPostModal}>
                          Share your first photo
                        </button>
                    }

                  </div>
                </article>              
              }
              {currentUsersPage && pageSelected === 'saved' &&
                <article className="no-saved-posts">
                  <span className="no-saved-top-text">
                    Only you can see what you've saved
                  </span>
                  <div className="no-saved-posts-content">
                    <div className="no-saved-posts-sprite">
                    </div>
                    <h1 className="no-saved-posts-title">
                      Save
                    </h1>
                    <span className="no-saved-posts-text">
                      Save photos and videos that you want to see again. No one is notified and only you can see what you've saved.
                    </span>
                  </div>
                </article>
              }
              {currentUsersPage && pageSelected === 'tagged' &&
                <article className="no-tagged-posts">
                  <div className="no-tagged-posts-content">
                    <div className="no-tagged-posts-sprite">
                    </div>
                    <h1 className="no-tagged-posts-title">
                      Photos of you
                    </h1>
                    <span className="no-tagged-posts-text">
                      When people tag you in photos, they'll appear here.
                    </span>
                  </div>
                </article>
              }
              {!currentUsersPage && width < 736 && (pageSelected === 'posts' || pageSelected === 'feed') &&
                <article className="no-posts-yet">
                  <div className="no-posts-yet-content">
                    <div className="camera-sprite-wrapper">
                      <span className="camera-sprite-no-posts">
                      </span>                      
                    </div>
                    <div className="no-posts-text-wrapper">
                      <h2 className="no-posts-text-header">
                        No Posts Yet
                      </h2>
                      <span className="no-posts-text">
                        {`When ${profileData.username} posts, you'll see their photos and videos here.`}
                      </span>
                    </div>                    
                  </div>
                </article>
              }
              {!currentUsersPage && width > 735 && (pageSelected === 'posts' || pageSelected === 'feed') &&
                <article className="no-posts-yet-wide">
                  <span className="camera-sprite-first-photo">
                  </span>                      
                  <h2 className="no-posts-text-header-wide">
                    No Posts Yet
                  </h2>
                </article>
              }
              {!currentUsersPage && pageSelected === 'tagged' &&
                <article className="no-tagged-posts-public">
                  <span className="no-tagged-sprite-public">
                  </span>                      
                  <h2 className="no-tagged-posts-title-public">
                    No Photos
                  </h2>
                </article>
              }
            </div>         
          </div>
        : <div className="no-user-profile">
            <h2 className="no-user-header">Sorry, this page isn't availble.</h2>
            <div className="no-user-text">The link you followed may be broken, or the page may have been removed. <Link to='/'>Go Back to Instagram.</Link></div>
          </div>
      }
    </main>
  )
};

export default Profile;

