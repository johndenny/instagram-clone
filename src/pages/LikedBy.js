import { useEffect } from 'react';
import './LikedBy.css'

const LikedBy = (props) => {
  const {
    selectedPost
  } = props;
  
  useEffect(() => {
    console.log(selectedPost);
  },[]);

  const {
    likes
  } = selectedPost[0];

  return (
    <main className='liked-by-wrapper'>
      {likes.map((like) => {
        const {
          username,
          photoURL,
          fullName,
        } = like;
        return (
          <div className='liked-by-user-wrapper'>
            <div className='profile-photo-frame liked-by'>
              <img alt={`${username}'s profile`} className='user-profile-photo liked-by' src={photoURL} />
            </div>
            <div className='name-text-wrapper'>
              <span className='liked-by-username-text'>
                {username}
              </span>
              <span className='full-name-text'>
                {fullName}
              </span>
            </div>
            <button className='liked-by-follow-button'>
              Follow
            </button>
          </div>
        )
      })}
    </main>
  )
}

export default LikedBy