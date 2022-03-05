import './EditProfile.css';
import defaultProfileImage from '../images/default-profile-image.jpg'
import ProfilePhotoModal from '../components/ProfilePhotoModal';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import firebaseApp from '../Firebase';
import {getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import {getAuth, updateEmail, updateProfile} from 'firebase/auth';

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const EditProfile = (props) => {
  const { 
    userData,
    profilePhotoURL, 
    profilePhotoModalToggle, 
    profilePhotoModal, 
    removeProfilePhoto, 
    uploadClick, 
    uploadHandler
  } = props;
  const [nameValue, setNameValue] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [websiteValue, setWebsiteValue] = useState('');
  const [originalWebsite, setOriginalWebsite] = useState('');
  const [bioValue, setBioValue] = useState('');
  const [originalBio, setOriginalBio] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [orginalEmail, setOrginalEmail] = useState('');
  const [phoneNumberValue, setPhoneNumberValue] = useState('');
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');
  const [genderValue, setGenderValue] = useState('');
  const [orginalGender, setOriginalGender] = useState('');
  const [suggestionValue, setSuggestionValue] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const getValues = async () => {
    const { 
      email,
      phoneNumber,
      displayName 
    } = userData;
    const docRef = doc(db, "users", userData.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document Data:', docSnap.data());
      const { 
        fullname,
        website,
        bio,
        gender,
        suggestions
      } = docSnap.data();
      setNameValue(fullname);
      setOriginalName(fullname)
      setUsernameValue(displayName);
      setOriginalUsername(displayName);
      setWebsiteValue(website);
      setOriginalWebsite(website);
      setBioValue(bio);
      setOriginalBio(bio);
      setEmailValue(email);
      setOrginalEmail(email);
      setPhoneNumberValue(phoneNumber);
      setOriginalPhoneNumber(phoneNumber);
      setGenderValue(gender);
      setOriginalGender(gender);
      setSuggestionValue(suggestions);
    } else {
      console.log('no document');
    }
  }

  useEffect(() => {
    getValues()
  }, [userData]);

  const inputHandler = (event) => {
    if (submitDisabled) {
      setSubmitDisabled(false);
    };
    const { id, value } = event.target;
    switch (true) {
      case id === 'edit-name-input':
        setNameValue(value);
        break;
      case id === 'edit-username-input':
        setUsernameValue(value);
        break;
      case id === 'edit-website-input':
        setWebsiteValue(value);
        break;
      case id === 'edit-bio-input':
        setBioValue(value);
        break;
      case id === 'edit-email-input':
        setEmailValue(value);
        break;
      case id === 'edit-phone-number-input':
        setPhoneNumberValue(value);
        break;
      case id === 'edit-gender-input':
        setGenderValue(value);
        break;
      case id === 'edit-account-suggestion':
        suggestionValue ? setSuggestionValue(false) : setSuggestionValue(true);
        break;
      default:
    }
  }

  const SubmitProfileEdit = async (event) => {
    event.target.preventDefault();
    try {
      await updateProfile(auth.currentUser, {
        displayName: usernameValue,
        phoneNumber: phoneNumberValue
      });
      await updateEmail(auth.currentUser, emailValue);
      await setDoc(doc(db, ))
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <main className="edit-profile-settings">
      {profilePhotoModal &&
        <ProfilePhotoModal 
          uploadClick={uploadClick} 
          uploadHandler={uploadHandler} 
          removeProfilePhoto={removeProfilePhoto} 
          profilePhotoModalToggle={profilePhotoModalToggle}
        />      
      }
      <div className='settings-sidebar-article-wrapper'>
        <ul className='settings-sidebar'>
          <li>
            <Link to="/accounts/edit" className='settings-link selected'>Edit Profile</Link>            
          </li>
          <li>
            <Link to="/accounts/edit" className='settings-link'>Change Password</Link>            
          </li>
        </ul>
        <article className='edit-profile-form-wrapper'>
          <div className='profile-photo-change'>
            <div className="profile-image">
              <button className="profile-image-button" onClick={profilePhotoModalToggle}>
                <label 
                  htmlFor="profile-image-upload" 
                  className={profilePhotoURL === null ? "upload-profile-image" : ["upload-profile-image", "hidden"].join(' ')}
                >
                  {profilePhotoURL !== null
                    ? <img alt="" src={profilePhotoURL}/>
                    : <img alt="" src={defaultProfileImage}/>
                  }
                </label>
                <form className="upload-profile-form">
                  <input 
                    id='profile-image-upload' 
                    accept="image/jpeg,image/png" 
                    className="upload-profile-input" 
                    type='file' onClick={uploadClick} 
                    onChange={uploadHandler}/>
                </form>
              </button>
            </div>
            <div className='change-profile-photo-text' onClick={profilePhotoModalToggle}>
              <h1 className='settings-username'>{userData.displayName}</h1>
              <button className='change-profile-photo-button'>Change Profile Photo</button>
            </div>
          </div>
          <form className='edit-account-form'>
            <div className='edit-account-section'>
              <label htmlFor='edit-name-input'>Name</label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <input 
                    className='edit-name-input' 
                    id="edit-name-input" 
                    autoComplete='off' 
                    defaultValue={nameValue} 
                    placeholder='Name' 
                    onChange={inputHandler}
                  />
                  <div className='account-edit-text'>
                    <span>
                      Help people discover your account by using the name you're known by: 
                      either your full name, nickname, or business name.
                    </span>
                    <span>
                      You can only change your name twice within 14 days.
                    </span>
                  </div>                     
                </div>
                
              </div>
            </div>
            <div className='edit-account-section'>
              <label htmlFor='edit-username-input'>Username</label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <input 
                    className='edit-username-input' 
                    id="edit-username-input" 
                    defaultValue={usernameValue} 
                    onChange={inputHandler}
                    placeholder="Username"
                  />
                  <div className='account-edit-text username'>
                    In most cases, you'll be able to change your username back to {userData.displayName} for another 14 days. 
                  </div>                   
                </div>
              </div>
            </div>
            <div className='edit-account-section'>
              <label htmlFor='edit-website-input'>Website</label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <input 
                    className='edit-website-input' 
                    id='edit-website-input' 
                    defaultValue={websiteValue} 
                    onChange={inputHandler} 
                    placeholder="Website"
                  />                  
                </div>
              </div>     
            </div>
            <div className='edit-account-section bio'>
              <label htmlFor='edit-bio-input'>Bio</label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <textarea 
                    className='edit-bio-input' 
                    id='edit-bio-input' 
                    defaultValue={bioValue} 
                    onChange={inputHandler} 
                  ></textarea>
                </div>
              </div>
            </div>
            <div className='edit-account-section'>
              <label></label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <h2 className='personal-information-header'>Personal information</h2>
                  <span className='personal-information-text'>
                  Provide your personal information, even if the account is used for a business, a pet or something else. 
                  This won't be a part of your public profile.
                  </span>                      
                </div>
              </div>
            </div>
            <div className='edit-account-section email'>
              <label htmlFor='edit-email-input'>Email</label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <input 
                    className='edit-email-input' 
                    id='edit-email-input' 
                    defaultValue={emailValue} 
                    onChange={inputHandler} 
                    placeholder="Email"
                  />                  
                </div>
              </div>
            </div>
            <div className='edit-account-section'>
              <label htmlFor='edit-phone-number-input'>Phone Number</label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <input 
                    className='edit-phone-number-input' 
                    id='edit-phone-number-input' 
                    defaultValue={phoneNumberValue} 
                    onChange={inputHandler}
                    placeholder="Phone Number" 
                  />                  
                </div>
              </div>
            </div>
            <div className='edit-account-section phone-button'>
              <label></label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <button className='edit-phone-number-button'>Confirm Phone Number</button>                  
                </div>
              </div>
            </div>
            <div className='edit-account-section gender'>
              <label htmlFor='edit-gender-input'>Gender</label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <input 
                    className='edit-gender-input' 
                    id='edit-gender-input' 
                    defaultValue={genderValue} 
                    onChange={inputHandler}
                    placeholder="Gender" 
                  />                  
                </div>
              </div>
            </div>
            <div className='edit-account-section'>
              <label>Similar Account Suggestions</label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <label htmlFor='edit-account-suggestion' className='account-suggestion-label' id='account-suggestion-label' >
                    <input 
                      className='edit-account-suggestion' 
                      id="edit-account-suggestion" 
                      type="checkbox" 
                      name='account-suggestion' 
                      onClick={inputHandler} 
                      checked={suggestionValue} 
                      readOnly
                    />
                    <div className='replacement-checkbox'></div>
                    <div className='checkbox-text'>
                      Include your account when recommending similar accounts people might want to follow.
                    </div>
                  </label>                  
                </div>
              </div>
            </div>
            <div className='edit-account-section'>
              <label></label>
              <div className='account-input-text-wrapper'>
                <div className='account-input-text-inner-wrapper'>
                  <div className='submit-button-disable-button'>
                    <button className='edit-account-submit-button' disabled={submitDisabled}>Submit</button>
                    <button className='edit-account-disable-button'>Temporarily disable my account</button>
                  </div>                  
                </div>
              </div>
            </div>
          </form>
        </article>
      </div>
    </main>
  )
}

export default EditProfile;