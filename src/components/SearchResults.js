import { useEffect } from 'react';
import PeopleList from './PeopleList';
import './SearchResults.css';

const SearchResults = (props) => {
  const {
    setIsMouseHovering,
    setSearchResults,
    setSearchString,
    searchResults,
    selectedListProfile,
    unfollowModalHandler,
    followHandler,
    userData,
    isFollowLoading,
  } = props;

  useEffect(() => () => {
    setSearchResults([]);
    setSearchString('');
  },[]);

  return (
    <main className='search-results'>
      <PeopleList
        setIsMouseHovering={setIsMouseHovering}
        // onMouseEnter={onMouseEnter}
        // onMouseLeave={onMouseLeave}
        selectedListProfile={selectedListProfile}
        allUserProfiles={searchResults}
        userData={userData}
        followHandler={followHandler}
        isFollowLoading={isFollowLoading}
        unfollowModalHandler={unfollowModalHandler}
      /> 
    </main>
  );
};

export default SearchResults;