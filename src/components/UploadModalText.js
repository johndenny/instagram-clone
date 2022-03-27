import { useEffect, useState } from 'react';
import './UploadModalText.css';

const UploadModalText = (props) => {
  const {
    captionText,
    setCaptionText,
    userData,
  } = props;
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [captionTextArray, setCaptionTextArray] = useState([]);

  const accessibilityToggle = () => {
    accessibilityOpen 
      ? setAccessibilityOpen(false) 
      : setAccessibilityOpen(true);
  }
  
  const advancedToggle = () => {
    advancedOpen
      ? setAdvancedOpen(false)
      : setAdvancedOpen(true);
  }

  const captionTextHandler = (event) => {
    const { value } = event.target;
    const valueArray = value.split('');
    if ((valueArray[valueArray.length - 1] === ' ' && captionTextArray[captionTextArray.length - 1] === ' ') || valueArray.length > 2200) {
      return
    } else {
      setCaptionText(value);
    }
  }

  useEffect(() => {
    setCaptionTextArray(captionText.split(''));
  }, [captionText]);

  return (
    <div className="upload-modal-text-page">
      <div className="user-header-text-page">
        <div className="upload-modal-profile-photo-frame">
          <img 
            className='upload-modal-profile-photo' 
            alt={`${userData.displayName}'s profile`} 
            src={userData.photoURL} 
            draggable='false'
          />
        </div>
        <div className="username-text">
          {userData.displayName}
        </div>
      </div>
      <div className="upload-modal-textarea-wrapper">
        <textarea 
          className='upload-modal-textarea' 
          placeholder='Write a caption...' 
          autoComplete='off' 
          autoCorrect='off'
          value={captionText}
          onChange={captionTextHandler} 
        >
        </textarea>
      </div>
      <div className="textarea-buttons-wrapper">
        <button className="textarea-emoji-button">
          <svg aria-label="Emoji" className="textarea-emoji-svg" color="#8e8e8e" fill="#8e8e8e" height="20" role="img" viewBox="0 0 24 24" width="20">
            <path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path>
          </svg>
        </button>
        <div className="text-length-wrapper">
          <span className="text-length">
            {captionTextArray.length}
          </span>
          <span className="maximum-text-length">
            /2,200
          </span>
        </div>
      </div>
      <div className="add-location-input-wrapper">
        <input 
          className="add-location-input" 
          placeholder='Add location'
          type='text'
          spellCheck='true'
        />
        <svg aria-label="Add location" className="add-location-svg" color="#8e8e8e" fill="#8e8e8e" height="16" role="img" viewBox="0 0 24 24" width="16">
          <path d="M12.053 8.105a1.604 1.604 0 101.604 1.604 1.604 1.604 0 00-1.604-1.604zm0-7.105a8.684 8.684 0 00-8.708 8.66c0 5.699 6.14 11.495 8.108 13.123a.939.939 0 001.2 0c1.969-1.628 8.109-7.424 8.109-13.123A8.684 8.684 0 0012.053 1zm0 19.662C9.29 18.198 5.345 13.645 5.345 9.66a6.709 6.709 0 0113.417 0c0 3.985-3.944 8.538-6.709 11.002z"></path>
        </svg>
      </div>
      <div className="accessibility-input-wrapper">
        <button 
          className={accessibilityOpen ? ["accessibility-input-button", "selected"].join(' ') : "accessibility-input-button"}
          onClick={accessibilityToggle}
        >
          <span className="accessibility-text">
            Accessibility
          </span>
          <span 
            className="accessibility-up-icon"
            style={{
              transform: `rotate(${accessibilityOpen ? 0 : 180}deg)`
            }}
          >
            <svg aria-label="Up Chevron Icon" className="up-icon-svg" color="#262626" fill="#262626" height="16" role="img" viewBox="0 0 24 24" width="16">
              <path d="M21 17.502a.997.997 0 01-.707-.293L12 8.913l-8.293 8.296a1 1 0 11-1.414-1.414l9-9.004a1.03 1.03 0 011.414 0l9 9.004A1 1 0 0121 17.502z"></path>
            </svg>
          </span>
        </button>
        {accessibilityOpen &&
          <div className="accessibility-photo-input-wrapper">
            <div className="accessibilty upload-photo-frame">
              <img />
            </div>
            <input className="accessibilty-input"/>
          </div>        
        }
      </div>
      <div className="advanced-settings-wrapper">
        <button 
          className={advancedOpen ? ["advanced-input-button", "selected"].join(' ') : "advanced-input-button"}
          onClick={advancedToggle}
        >
          <span className="advanced-text">
            Advanced Settings
          </span>
          <span 
            className="advanced-up-icon"
            style={{
              transform: `rotate(${advancedOpen ? 0 : 180}deg)`
            }}
          >
            <svg aria-label="Up Chevron Icon" className="up-icon-svg" color="#262626" fill="#262626" height="16" role="img" viewBox="0 0 24 24" width="16">
              <path d="M21 17.502a.997.997 0 01-.707-.293L12 8.913l-8.293 8.296a1 1 0 11-1.414-1.414l9-9.004a1.03 1.03 0 011.414 0l9 9.004A1 1 0 0121 17.502z"></path>
            </svg>
          </span>
        </button>
        {advancedOpen &&
          <div className='advanced-toggle-content'>
            <div className="advanced-toggle-wrapper">
              <span className="turn-off-comments-text">
                Turn off commenting
              </span>
              <input type='checkbox'/>
            </div>
            <div className="advanced-detail-text">
              You can change this later by going to the ··· menu at the top of your post.
            </div>
          </div>              
        }
        </div>
    </div>
  )
}

export default UploadModalText