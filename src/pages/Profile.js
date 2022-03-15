import defaultProfileImage from "../images/default-profile-image.jpg";
import './Profile.css';
import React, { useEffect, useState } from "react";
import ProfilePhotoModal from "../components/ProfilePhotoModal";
import { Link, useParams} from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import firebaseApp from "../Firebase";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore(firebaseApp);
const auth = getAuth();

const Profile = (props) => {
  const {
    setDataLoading,
    getUserProfileData,
    profileExists,
    currentUsersPage,
    profileData,
    profileImages,
    toggleTopNavigation,
    profilePhotoURL, 
    uploadClick, 
    uploadHandler, 
    removeProfilePhoto, 
    profilePhotoModal, 
    profilePhotoModalToggle 
  } = props;
  const [width, height] = useWindowSize();
  // const [profileData, setUserDetails] = useState({});
  // const [uid, setUID] = useState(null);
  const params = useParams();
  // const [userExists, setUserExists] = useState('');

  useEffect(() => {
    if (profileData.length === 0) {
      console.log('params:', params.username);
      setDataLoading(true)
      getUserProfileData(params.username);
    }
  }, []);

  // const getUID = async () => {
  //   const user = auth.currentUser;
  //   const { username } = params;
  //   const docRef = doc(db, 'displayNames', username)
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     const { uid } = docSnap.data();
  //     setUID(uid)
  //       setUserExists(true);
  //       toggleTopNavigation(false);
  //       if (uid === user.uid) {
  //         setCurrentUsersPage(true);
  //       } else {
  //         setCurrentUsersPage(false);
  //       }
  //   } else {
  //     console.log('no displayName document');
  //     setUserExists(false)
  //     toggleTopNavigation(true);
  //   };     
  // };

  // const getUserData = async () => {
  //   const docRef = doc(db, "users", uid);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     console.log('Document Data:', docSnap.data());
  //     setUserDetails(docSnap.data());
  //   } else {
  //     console.log('no document');
  //   }
  // }

  // const getUserImageData = async () => {
  //   const q = query(collection(db, 'photoUploads'), where('uid', '==', uid));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.id, '=>', doc.data());
  //   });
  // };

  // useEffect(() => {
  //   if (uid !== null) {
  //     getUserData();
  //     getUserImageData();       
  //   }
  // }, [uid]);

  // useEffect(() => {
  //   getUID();
  // }, [params]);

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
                        <button className="setting-quick-links-button">
                          {currentUsersPage
                            ? <svg aria-label="Options" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                <circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                                <path d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                              </svg>
                            : <svg aria-label="Options" className="_8-yf5 " color="#262626" fill="#262626" height="32" role="img" viewBox="0 0 24 24" width="32">
                                <circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>
                              </svg>
                          }

                        </button>
                      </div>
                    </div>
                    <div className="profile-numbers-wrapper">
                      <ul className="profile-numbers-list">
                        <li className="posts-number-wrapper">
                          <div className="posts-wrapper">
                            <span className="posts-made">9</span>
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
                  <Link to='/' className="profile-tabs posts">
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
                  <Link to='/' className="profile-tabs saved">
                    <div className="tablist-icon-text-wrapper">
                      <svg aria-label="" className="tablist-svg" color="#8e8e8e" fill="#8e8e8e" height="12" role="img" viewBox="0 0 24 24" width="12">
                        <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                      </svg>
                      <span>
                        SAVED
                      </span>
                    </div>
                  </Link>
                  <Link to='/' className="profile-tabs tagged">
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
            {width < 736 &&
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
                        <button className="setting-quick-links-button">
                          <svg aria-label="Options" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                            <path d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                          </svg>
                        </button>
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
                      <span className="posts-made">9</span>
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
                  <Link to='/' className="profile-tabs posts">
                  <svg aria-label="Posts" className="tablist-svg" color="#0095f6" fill="#0095f6" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                  </svg>
                  </Link>
                  <Link to='/' className="profile-tabs saved">
                    <svg aria-label="Saved" className="tablist-svg" color="#8e8e8e" fill="#8e8e8e" height="24" role="img" viewBox="0 0 24 24" width="24">
                      <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                    </svg>
                  </Link>
                  <Link to='/' className="profile-tabs tagged">
                  <svg aria-label="Tagged" className="tablist-svg" color="#8e8e8e" fill="#8e8e8e" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <path d="M10.201 3.797L12 1.997l1.799 1.8a1.59 1.59 0 001.124.465h5.259A1.818 1.818 0 0122 6.08v14.104a1.818 1.818 0 01-1.818 1.818H3.818A1.818 1.818 0 012 20.184V6.08a1.818 1.818 0 011.818-1.818h5.26a1.59 1.59 0 001.123-.465z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M18.598 22.002V21.4a3.949 3.949 0 00-3.948-3.949H9.495A3.949 3.949 0 005.546 21.4v.603" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <circle cx="12.072" cy="11.075" fill="none" r="3.556" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  </svg>
                  </Link>
                </div>            
              </React.Fragment>
            }
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

