import { useEffect } from 'react';
import './SearchDropDown.css';
import SearchResults from './SearchResults';

const SearchDropDown = (props) => {
  const {
    deleteRecentSearch,
    isNoMatch,
    isSearching,
    clearRecentSearch,
    searchString,
    saveRecentSearch,
    setMenuClicked,
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

  const mouseDownHandler = () => {
    setMenuClicked(true);
  }

  return (
    <div className='search-drop-down'>
      <div 
        className='search-drop-down-content'
        onMouseDown={mouseDownHandler}
      >
        <div className='search-drop-down-triangle'>
        </div>
        <SearchResults
          deleteRecentSearch={deleteRecentSearch}
          isNoMatch={isNoMatch}
          isSearching={isSearching}
          clearRecentSearch={clearRecentSearch}
          searchString={searchString}
          saveRecentSearch={saveRecentSearch}
          setIsMouseHovering={setIsMouseHovering}
          setSearchString={setSearchString}
          setSearchResults={setSearchResults} 
          searchResults={searchResults}
          selectedListProfile={selectedListProfile}
          userData={userData}
          followHandler={followHandler}
          isFollowLoading={isFollowLoading}
          unfollowModalHandler={unfollowModalHandler}
        />
      </div>
    </div>
  );
};

export default SearchDropDown;