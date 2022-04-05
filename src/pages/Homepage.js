import './Homepage.css';
import ProfileImagesLoader from '../components/ProfileImagesLoader';
import MobilePhotoPost from './MobilePhotoPost';

const Homepage = (props) => {
  const {
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
  return (
    <main className='homepage-sidebar-wrapper'>
      {/* <ProfileImagesLoader
        likeUploadToggle={likeUploadToggle}
        userData={userData}
        setIsLoadingPage={setIsLoadingPage}
        getPostData={getPostData}
        postLinksModalHandler={postLinksModalHandler}
        isMobile={isMobile}
        profileData={profileData} 
        photosArray={photosArray}
        setPhotosArray={setPhotosArray}
      /> */}
      <section className='homepage-posts-wrapper'>
        {photosArray.map((post, index) => {
          return (
            
              <MobilePhotoPost
                index={index}
                setPhotosArray={setPhotosArray}
                photosArray={photosArray}
                getFollowingPosts={getFollowingPosts}
                selectedPost={post}
                setIsLoadingPage={setIsLoadingPage}
                likeUploadToggle={likeUploadToggle}
                userData={userData}
              />                
            
          )
        })}
      </section>        
    </main>
  )
}

export default Homepage;