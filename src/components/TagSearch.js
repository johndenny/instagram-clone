import './TagSearch.css';
import PeopleList from './PeopleList';
import { useEffect, useRef } from 'react';
import { useNavigate, } from 'react-router-dom';

const TagSearch = (props) => {
  const {
    tagData,
    setIsSearchOpen,
    touchLocation,
    setTagData,
    searchResults,
    searchString,
    setSearchString,
    setSearchResults,
    cancelSearchHandler,
  } = props;
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const searchInputHandler = (event) => {
    const { value } = event.target;
    if (value !== '') {
      searchInputRef.current.focus();
    }
    setSearchString(value);
  }

  const tagUserSelection = (username, uid) => {
    const userIndex = tagData.findIndex((tag) => tag.uid === uid);
    const data = {
        ...touchLocation,
        username: username,
        uid: uid
    }
    if (userIndex === -1) {
      setTagData([...tagData, data]);      
    } else {
      const newTagData = [...tagData];
      newTagData.splice(userIndex, 1, data);
      setTagData(newTagData);
    }
    setIsSearchOpen(false);
  }

  useEffect(() => () => {
    setSearchString('');
    setSearchResults([]);
  }, []);

  return (
    <div className='tag-search-content'>
      <header className="mobile-upload-search-header">
        <div className="mobile-explore-search-wrapper">
          <label className="mobile-search-label">
            <input 
              className="mobile-explore-search-input" 
              type='text' 
              value={searchString} 
              onChange={searchInputHandler} 
              ref={searchInputRef}
            />
            <div 
              className={searchString === '' ? "search-explore-placeholder" : 'search-explore-placeholder focused'}
            >
              <span className="search-glyph-sprite">
              </span>
              {searchString === '' &&
                <span className="search-placeholder-text">
                  Search
                </span>                
              }
            </div>
            {searchString !== '' &&
              <button 
                className="clear-search-button"
                onClick={() => setSearchString('')}
              >
                <span className="clear-search-glyph-sprite">
                </span>
              </button>              
            }
          </label>
        </div>
      </header>
      <main className='search-results'>
        {searchString !== '' &&
          <PeopleList
            tagUserSelection={tagUserSelection}
            isTag={true}
            isSearch={true}
            allUserProfiles={searchResults}
          />      
        }
      </main>   
    </div>
  );
};

export default TagSearch;