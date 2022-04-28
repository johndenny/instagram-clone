import './MessageLinksModal.css';

const MessageLinksModal = (props) => {

  const stopBubbles = (event) => {
    event.stopPropagation();
  }


  return (
    <div 
      className="profile-photo-modal" 
    >
        <div 
          className="post-links-content" 
          onClick={stopBubbles}
        >
          <div className="post-links-buttons">
            <button 
              className='copy-message-button'
            >
              Copy
            </button>            
            <button 
              className="unsend-message-button"
            >
              Unsend
            </button>          
            <button 
              className="cancel-button" 
            >
              Cancel
            </button>
          </div>
        </div>      
    </div>
  )
};

export default MessageLinksModal;