import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './MobileComments.css'
import firebaseApp from '../Firebase';
import { getFirestore, doc, updateDoc, arrayUnion, query, collection, where, orderBy, getDocs, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom';

const db = getFirestore();

const MobileComments = (props) => {
  const {
    userData,
    setDataLoading, 
    setSelectedPost,
    selectedPost,
  } = props;
  const params = useParams();
  const [commentText, setCommentText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef(null);
  const commentsListRef = useRef(null);

  const commentTextHandler = (event) => {
    const { value } = event.target;
    const valueArray = value.split('');
    if (commentText === '' && value === ' ') {
      return
    }
    if ((valueArray[valueArray.length - 1] === ' ' && commentText[commentText.length - 1] === ' ') || valueArray.length > 2200) {
      return
    } else {
      setCommentText(value)
    }
  }

  useLayoutEffect(() => {
    if (selectedPost !== '') {
      textareaRef.current.style.height = '1px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      console.log(textareaRef.current.scrollHeight);      
    }
  }, [commentText]);

  const getPostData = async () => {
    const { postID } = params;
    setDataLoading(true)
    const photoArray = [];
    const profilePhotoData = query(collection(db, 'photoUploads'), 
      where('postID', '==', postID), orderBy('index'));
    const profileImageDataSnap = await getDocs(profilePhotoData);
    profileImageDataSnap.forEach((doc) => {
      photoArray.push(doc.data());
    });
    const profilePostDocument = doc(db, 'postUploads', postID);
    const postSnap = await getDoc(profilePostDocument);

    console.log([postSnap.data(), ...photoArray]);
    setSelectedPost([postSnap.data(), ...photoArray]);
    setDataLoading(false);
  };

  useEffect(() => {
    if (selectedPost === '') {
      getPostData()
    }
  }, []);

  if (selectedPost !== '') {
    const {
      postID,
      comments,
      postCaption,
      uploadDate
    } = selectedPost[0];
    const {
      username,
      photoURL,
      uid,
    } = userData;
    
    const postComment = async (event) => {
      if (event !== undefined) {
        event.preventDefault();
      }
      setIsSaving(true);
      const postRef = doc(db, 'postUploads', postID);
      await updateDoc(postRef, {
        comments: arrayUnion({
          commentID: uuidv4(),
          photoURL: photoURL,
          text: commentText,
          uid: uid,
          uploadDate: Date.now(),
          username: username
        })
      });
      const photoArray = [];
      const profilePhotoData = query(collection(db, 'photoUploads'), 
        where('postID', '==', postID), orderBy('index'));
      const profileImageDataSnap = await getDocs(profilePhotoData);
      profileImageDataSnap.forEach((doc) => {
        photoArray.push(doc.data());
      });
      const profilePostDocument = doc(db, 'postUploads', postID);
      const postSnap = await getDoc(profilePostDocument);
  
      console.log([postSnap.data(), ...photoArray]);
      setSelectedPost([postSnap.data(), ...photoArray]);
      setCommentText('');
      setIsSaving(false);
      commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight;
    };
  
    const enterKeyHandler = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        postComment();
      };
    };    

    return (
      <main className='post-comments-input'>
        <section className='profile-photo-input-wrapper'>
          <div className='profile-photo-frame'>
            <img 
              alt={`${username}'s profile`} 
              src={photoURL} 
              className="comments-profile-photo"
            /> 
          </div>
          <form className='comment-submit-form'>
            <div className={isSaving ? 'comment-spinner-wrapper' : 'comment-spinner-wrapper hidden'}>
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
            </div>
            <textarea 
              className='comment-textarea'
              aria-label='Add a comment...'
              placeholder='Add a comment...'
              autoComplete='off'
              autoCorrect='off'
              ref={textareaRef}
              value={commentText}
              onChange={commentTextHandler}
              onKeyDown={enterKeyHandler}
            ></textarea>
            <button 
              className='post-comment-button'
              disabled={commentText.length === 0}
              type='button'
              onClick={postComment}
            >
              Post
            </button>
          </form>        
        </section>
        <div className='post-comments-wrapper'>
          <ul 
            className='comment-list'
            ref={commentsListRef}
          >
            <li className='comment-wrapper'>
              <div className='comment-profile-photo-frame'>
                <img 
                  alt={`${selectedPost[0].username}'s profile`} 
                  src={selectedPost[0].photoURL} 
                  className="comments-profile-photo"
                /> 
              </div>
              <div className='comment-text-time-wrapper'>
                <div className='comment-text-wrapper'>
                  <h2 className='comment-username'>
                    {selectedPost[0].username}
                  </h2>
                  <span className='comment-text'>
                    {postCaption}
                  </span>                    
                </div>
                <time className='comment-time-stamp'>
                  {new Date(uploadDate).toDateString()}
                </time>
              </div>
              
            </li>
            {comments.map((comment) => {
              const {
                commentID,
                username,
                text,
                photoURL,
                uploadDate,
              } = comment;
              return (
                <li key={commentID} className='comment-wrapper'>
                  <div className='comment-profile-photo-frame'>
                    <img 
                      alt={`${username}'s profile`} 
                      src={photoURL} 
                      className="comments-profile-photo"
                    /> 
                  </div>
                  <div className='comment-text-time-wrapper'>
                    <div className='comment-text-wrapper'>
                      <h2 className='comment-username'>
                        {username}
                      </h2>
                      <span className='comment-text'>
                        {text}
                      </span>                    
                    </div>
                    <time className='comment-time-stamp'>
                      {new Date(uploadDate).toDateString()}
                    </time>
                  </div>
                  
                </li>
              )
            })}
          </ul>
        </div>
      </main>
    )    
  } else {
    return (
      <div></div>
    )
  }
}

export default MobileComments;