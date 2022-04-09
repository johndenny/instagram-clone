import './Homepage.css';
import ProfileImagesLoader from '../components/ProfileImagesLoader';
import MobilePhotoPost from './MobilePhotoPost';
import HomepageFixedMenu from '../components/HomepageFixedMenu';
import { useEffect } from 'react';
import useWindowSize from '../hooks/useWindowSize';

const Homepage = (props) => {
  const {
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
    getUserProfiles();
  }, []);

  return (
    <main className='homepage-sidebar-wrapper'>
      <div className='homepage-width-wrapper'>
        <section className='homepage-posts-wrapper'>
          {photosArray.map((post, index) => {
            return (
              <div key={post[0].postID}>
                <MobilePhotoPost
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
                />               
              </div>
            )
          })}
        </section>
        {!isMobile && width > 999 &&
          <HomepageFixedMenu
            followHandler={followHandler}
            isFollowLoading={isFollowLoading}
            unfollowModalHandler={unfollowModalHandler}
            userData={userData}
            allUserProfiles={allUserProfiles}
          />           
        }
      </div>
    </main>
  )
}

export default Homepage;