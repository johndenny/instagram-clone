import './Homepage.css';
import ProfileImagesLoader from '../components/ProfileImagesLoader';
import MobilePhotoPost from './MobilePhotoPost';
import HomepageFixedMenu from '../components/HomepageFixedMenu';
import { useEffect, useRef } from 'react';
import useWindowSize from '../hooks/useWindowSize';

const Homepage = (props) => {
  const {
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
    postLinksModalHandler,
    isMobile,
    profileData,
    photosArray,
    setPhotosArray,
  } = props;
  const [width, height] = useWindowSize();

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0 && Object.getPrototypeOf(userData) === Object.prototype) {
      getUserProfiles();
    }
  }, [userData]);

  return (
    <main className='homepage-sidebar-wrapper'>
      <div className='homepage-width-wrapper'>
        <section className='homepage-posts-wrapper'>
          {photosArray.map((post, index) => {
            return (
              <div className='homepage-post' key={post[0].postID}>
                <MobilePhotoPost
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  setIsMouseHovering={setIsMouseHovering}
                  getUserProfileData={getUserProfileData}
                  setBackgroundLocation={setBackgroundLocation}
                  postLinksModalHandler={postLinksModalHandler}
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