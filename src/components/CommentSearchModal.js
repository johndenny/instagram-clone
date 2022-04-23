import './CommentSearchModal.css';
import PeopleList from './PeopleList';

const CommentSearchModal = (props) => {
  const {
    textareaRef,
    setUserIndex,
    setIsSearching,
    userIndex,
    commentText,
    setCommentText,
    isSearchModalFlipped,
    searchResults
  } = props;

  const searchSelection = (username) => {
    const slicedComment = commentText.slice(0, userIndex);
    const name = `${username} `
    const newCommentText = slicedComment.concat(name);
    setCommentText(newCommentText);
    setUserIndex(null)
    setIsSearching(false);
    textareaRef.current.focus();
  }

  return (
    <section 
      className='comment-search-modal'
      style={isSearchModalFlipped 
        ? {
          transform: `translateY(${isSearchModalFlipped ? 100 : -100}%)`,
          bottom: 0
        }
        : {
          transform: `translateY(${isSearchModalFlipped ? 100 : -100}%)`,
          top: 0
        }
      }
    >
      <PeopleList
        searchSelection={searchSelection}
        isTag={false}
        isSearch={true}
        isComment={true}
        allUserProfiles={searchResults}
      />  
    </section>
  )
}

export default CommentSearchModal;