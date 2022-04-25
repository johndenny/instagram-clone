import './Message.css';

const Message = (props) => {
  const {
    userData,
    message
  } = props;
  const {
    messageID,
    text,
    uid,
    photoURL,
  } = message;

  return (
    <div className='message-profile-photo-wrapper'>
      {userData.uid !== uid &&
      <div className='profile-photo-frame'>
        <img alt='' className='profile-photo' src={photoURL} />
      </div>
      }
      <div 
        key={messageID}
        className='message-content'
      >
        {text}
      </div>      
    </div>
  );
};

export default Message;