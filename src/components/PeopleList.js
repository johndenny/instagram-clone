import { useRef } from 'react';
import FollowButton from './FollowButton.js';
import './PeopleList.css'
import defaultProfile from '../images/default-profile-image.jpg';
import { Link, useNavigate } from 'react-router-dom';

const PeopleList = (props) => {
  const {
    setIsMouseHovering,
    onMouseEnter,
    onMouseLeave,
    selectedListProfile,
    allUserProfiles,
    userData,
    followHandler,
    isFollowLoading,
    unfollowModalHandler,
  } = props;
  const navigate = useNavigate();
  const usernameRef = useRef([]);
  const photoRef = useRef([]);

  const navigateUserProfile = (username) => {
    setIsMouseHovering(false);
    navigate(`/${username}`);
  }
  
  if (userData && Object.keys(userData).length > 0 && Object.getPrototypeOf(userData) === Object.prototype) {
    console.log(allUserProfiles);
    return (
      <ul className='people-list'>
        {allUserProfiles.map((user, index) => {
          const {
            username,
            photoURL,
            fullname,
            fullName,
            uid,
          } = user;
          return (
            <div 
              key={uid}
              className='user-wrapper'
            >
              <div
                to={`/${username}`}
                className='profile-photo-frame'
                ref={(element) => photoRef.current.push(element)}
                onMouseEnter={() => onMouseEnter(uid, photoRef.current[index])}
                onMouseLeave={onMouseLeave}
                onClick={() => navigateUserProfile(username)} 
              >
                <img alt={`${username}'s profile`} className='user-profile-photo' src={photoURL === '' ? defaultProfile : photoURL} />
              </div>
              <div className='user-text-wrapper'>
                <span 
                  to={`/${username}`}
                  className='username-text'
                  ref={(element) => usernameRef.current.push(element)}
                  onMouseEnter={() => onMouseEnter(uid, usernameRef.current[index])}
                  onMouseLeave={onMouseLeave} 
                  onClick={() => navigateUserProfile(username)}
                >
                  {username}
                </span>
                <span className='full-name-text'>
                  {fullname || fullName}
                </span>
              </div>
              <FollowButton
                selectedListProfile={selectedListProfile}
                userData={userData}
                followHandler={followHandler}
                unfollowModalHandler={unfollowModalHandler}
                isFollowLoading={isFollowLoading}
                user={user}
              />
              {/* {followIndex === -1 && uid !== userData.uid &&
                <button 
                  className='liked-by-follow-button'
                  onClick={() => followHandler(user)}
                >
                  <div 
                    className={isFollowLoading ? 'follow-spinner' : 'follow-spinner hidden'}
                  >
                    <svg aria-label="Loading..." className='follow-spinner-svg' viewBox="0 0 100 100">
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
                  Follow
                </button>            
              }
              {followIndex !== -1 && uid !== userData.uid &&
                <button 
                  className='liked-by-following-button'
                  onClick={() => unfollowModalHandler(user)}
                >
                <div 
                  className={isFollowLoading ? 'follow-spinner' : 'follow-spinner hidden'}
                >
                  <svg aria-label="Loading..." className='follow-spinner-svg' viewBox="0 0 100 100">
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
                Following
              </button> 
              } */}
            </div>
          )
        })}
      </ul>
    );  
  } else {
    return null;
  }
  
};

export default PeopleList;