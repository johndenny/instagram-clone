import React, { useState, useEffect } from 'react';
import PeopleList from './PeopleList';
import './SearchResults.css';

const SearchResults = (props) => {
  const {
    deleteRecentSearch,
    isNoMatch,
    isSearching,
    clearRecentSearch,
    searchString,
    saveRecentSearch,
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
  const [sortedRecentSearch, setSortedRecentSearch] = useState([]);

  // useEffect(() => () => {
  //   setSearchResults([]);
  //   setSearchString('');
  // },[]);

  useEffect(() => {
    const sortedArray = [...userData.recentSearch]
    sortedArray.sort((a, z) => {
      return z.uploadDate - a.uploadDate; 
    })
    setSortedRecentSearch(sortedArray);
  },[userData])

  return (
    <main className='search-results'>
      {searchString === '' &&
        <div className='recent-search-header'>
          <h1 className='recent-search-header-text'>
            Recent
          </h1>
          {userData.recentSearch.length > 0 &&
            <button 
              className='recent-search-clear-button'
              onClick={clearRecentSearch}
            >
              Clear All
            </button>          
          }
        </div>      
      }
      {isSearching &&
        <span className='no-recent-searches-text'>
          <svg aria-label="Loading..." className='spinner' viewBox="0 0 100 100">
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
        </span>
      }
      {searchString !== '' && searchResults.length === 0 && isNoMatch &&
        <span className='no-recent-searches-text'>
          No match found.
        </span>
      }
      {searchString === '' && userData.recentSearch.length === 0 &&
        <span className='no-recent-searches-text'>
          No recent searches.
        </span>
      }
      {userData.recentSearch.length > 0 && searchString === '' &&        
        <PeopleList
          isRecentSearch={true}
          deleteRecentSearch={deleteRecentSearch}
          isSearch={true}
          saveRecentSearch={saveRecentSearch}
          setIsMouseHovering={setIsMouseHovering}
          // onMouseEnter={onMouseEnter}
          // onMouseLeave={onMouseLeave}
          selectedListProfile={selectedListProfile}
          allUserProfiles={sortedRecentSearch}
          userData={userData}
          followHandler={followHandler}
          isFollowLoading={isFollowLoading}
          unfollowModalHandler={unfollowModalHandler}
        />         
      }
      {searchString !== '' &&
        <PeopleList
          isSearch={true}
          saveRecentSearch={saveRecentSearch}
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
      }
    </main>
  );
};

export default SearchResults;