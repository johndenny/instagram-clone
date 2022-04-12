import { useEffect } from 'react';
import './LikedBy.css'
import PeopleList from '../components/PeopleList';

const LikedBy = (props) => {
  const {
    selectedListProfile,
    unfollowModalHandler,
    followHandler,
    userData,
    selectedPost,
    isFollowLoading,
  } = props;

  useEffect(() => {
    console.log(selectedPost[0].likes);
  }, [])

  return (
    <main className='liked-by-wrapper'>
      <PeopleList
        // onMouseEnter={onMouseEnter}
        // onMouseLeave={onMouseLeave}
        selectedListProfile={selectedListProfile}
        allUserProfiles={selectedPost[0].likes}
        userData={userData}
        followHandler={followHandler}
        isFollowLoading={isFollowLoading}
        unfollowModalHandler={unfollowModalHandler}
      /> 
    </main>
  )
}

export default LikedBy