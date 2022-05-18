import './Homepage.css';
import ProfileImagesLoader from '../components/ProfileImagesLoader';
import MobilePhotoPost from './MobilePhotoPost';
import HomepageFixedMenu from '../components/HomepageFixedMenu';
import { useEffect, useRef, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';

const Homepage = (props) => {
  const {
    dataLoading,
    isHomePageLoading,
    profileTagHandler,
    setIsSharePostOpen,
    setPostToSend,
    searchResults,
    setSearchString,
    stringToLinks,
    setIsLocationPost,
    setIsPostLinksOpen,
    isPostLinksOpen,
    onMouseEnter,
    onMouseLeave,
    setIsMouseHovering,
    selectedListProfile,
    followHandler,
    isFollowLoading,
    unfollowModalHandler,
    getUserProfiles,
    allUserProfiles,
    getUserProfileData,
    setBackgroundLocation,
    setIsLikedByModalOpen,
    setSelectedPost,
    setDataLoading,
    getFollowingPosts,
    likeUploadToggle,
    userData,
    setIsLoadingPage,
    getPostData,
    isMobile,
    profileData,
    photosArray,
    setPhotosArray,
  } = props;
  const [width, height] = useWindowSize();
  const postReference = useRef(null);
  const [postHeightArray, setPostHeightArray] = useState([]);
  const topRowsPast = useRef(null);
  const scrollTimerReference = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [pageYOffset, setPageYOffset] = useState(0);
  const [indexInView, setIndexInView] = useState(0);
  const [padding, setPadding] = useState(0)

  const scrollHandler = () => {
    setPageYOffset(window.pageYOffset);
  };

  useEffect(() => {
    console.log(postHeightArray);
  }, [postHeightArray]);

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0 && Object.getPrototypeOf(userData) === Object.prototype) {
      getUserProfiles();
    }
  }, [userData.uid]);

  useEffect(() => {
    setSelectedPost('');
  },[]);

  return (
    <main className='homepage-sidebar-wrapper'>
      <div className={
        isMobile
          ? 'homepage-width-wrapper mobile'
          : 'homepage-width-wrapper'
        }
      >
        <section 
          className='homepage-posts-wrapper'
          style={{
            paddingTop: `${padding}px`
          }}
        >
          {isHomePageLoading &&
            <div className='homepage-spinner-wrapper'>
              <svg aria-label="Loading..." className='spinner activity' viewBox="0 0 100 100">
                <rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47">
                </rect>
                <rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47">
                </rect>
              </svg> 
            </div>        
          }
          {photosArray.map((post, index) => {
            if (index < (indexInView - 6)) {
              return (
                <div 
                  className='homepage-post'
                  style={{
                    paddingBottom: `${postHeightArray[index].height}px`
                  }}
                ></div>
              );
            }
            if (index > (indexInView + 6)) {
              return null
            }
            return (
              <div 
                className='homepage-post' 
                key={post[0].postID}
                ref={postReference}
              >
                <MobilePhotoPost
                  setIndexInView = {setIndexInView}
                  postHeightArray = {postHeightArray}
                  setPostHeightArray = {setPostHeightArray}
                  pageYOffset = {pageYOffset}
                  topRowsPast = {topRowsPast}
                  profileTagHandler = {profileTagHandler}
                  setIsSharePostOpen={setIsSharePostOpen}
                  setPostToSend={setPostToSend}
                  searchResults={searchResults}
                  setSearchString={setSearchString}
                  stringToLinks={stringToLinks}
                  setIsLocationPost={setIsLocationPost}
                  setIsPostLinksOpen={setIsPostLinksOpen}
                  isPostLinksOpen={isPostLinksOpen}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  setIsMouseHovering={setIsMouseHovering}
                  getUserProfileData={getUserProfileData}
                  setBackgroundLocation={setBackgroundLocation}
                  isMobile={isMobile}
                  setIsLikedByModalOpen={setIsLikedByModalOpen}
                  setSelectedPost={setSelectedPost}
                  setDataLoading={setDataLoading}
                  index={index}
                  setPhotosArray={setPhotosArray}
                  photosArray={photosArray}
                  getFollowingPosts={getFollowingPosts}
                  selectedPost={post}
                  setIsLoadingPage={setIsLoadingPage}
                  likeUploadToggle={likeUploadToggle}
                  userData={userData}
                  followHandler={followHandler}
                  isFollowLoading={isFollowLoading}
                  unfollowModalHandler={unfollowModalHandler}
                  allUserProfiles={allUserProfiles}
                  selectedListProfile={selectedListProfile}
                />               
              </div>
            )
          })}
        </section>
        {!isMobile && width > 999 &&
          <HomepageFixedMenu
            setIsMouseHovering={setIsMouseHovering}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            followHandler={followHandler}
            isFollowLoading={isFollowLoading}
            unfollowModalHandler={unfollowModalHandler}
            userData={userData}
            allUserProfiles={allUserProfiles}
            selectedListProfile={selectedListProfile}
          />           
        }
      </div>
    </main>
  )
}

export default Homepage;