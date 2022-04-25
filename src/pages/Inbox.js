import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inbox.css';

const Inbox = (props) => {
  const {
    userData,
    directMessages,
    setIsInboxOpen,
  } = props;
  const navigate = useNavigate();

  useEffect(() => {
    setIsInboxOpen(true);
    return () => setIsInboxOpen(false);
  });

  useEffect(() => {
    console.log(directMessages)
  })

  return (
    <main className='direct-inbox'>
      <ul className='direct-inbox-messages'>
        {directMessages.map((directMessage) => {
          const {
            uid
          } = userData;
          const {
            profiles,
            directMessageID,
          } = directMessage;
          const profileIndex = profiles.findIndex((profile) => profile.uid !== uid);
          const {
            photoURL,
            fullname
          } = profiles[profileIndex];
          console.log(profiles[profileIndex])
          const fullnames = [];
          profiles.findIndex((profile) => {
            const {
              fullname,
            } = profile;
            if (profile.uid !== uid) {
              fullnames.push(fullname);
            };
          });
          return (
            <li 
              className='direct-message-card'
              key={directMessageID}
              onClick={() => navigate(`/direct/t/${directMessageID}/`)}
            >
              <div className='profile-photo-frame'>
                <img alt='' className='profile-photo' src={photoURL} />
              </div>
              <span className='direct-message-full-name'>
                {fullnames.join(', ')}
              </span>
            </li>
          )
        })}
      </ul>
    </main>
  )
};

export default Inbox;