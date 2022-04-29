import './DeleteChatModal.css';

const DeleteChatModal = (props) => {
  const {
    setIsDeleteChatOpen,
    selectedDirectMessageID,
  } = props;

  const deleteChat = () => {
  }

  return(
    <div 
      className="profile-photo-modal"
      onClick={() => setIsDeleteChatOpen(false)}
    >
      <div 
        className="post-links-content" 
        onClick={(event) => event.stopPropagation()}
      >
        <div className="post-links-buttons">
          <div className="discard-post-modal-text">
            <h1 className="discard-modal-title-text">
              Delete Chat?
            </h1>
            <div className="discard-modal-text">
              Deleting removes the chat from your inbox, but no one else's inbox.
            </div>
          </div>
          <button 
            className="discard-modal-button" 
          >
            Delete
          </button>
          <button 
            className="discard-modal-cancel-button"
            onClick={() => setIsDeleteChatOpen(false)} 
          >
            Cancel
          </button>
        </div>
      </div>
  </div>
  );
};

export default DeleteChatModal;