import './PostComments.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import firebaseApp from '../Firebase';
import { getFirestore, doc, updateDoc, arrayUnion, query, collection, where, orderBy, getDocs, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom';

const db = getFirestore();

const PostComments = (props) => {
  const {
    postCommentsRef,
    setSelectedPost,
    newComments,
    setNewComments,
    userData,
    postID,
  } = props;
  const params = useParams();
  const [commentText, setCommentText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef(null);

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
      textareaRef.current.style.height = '1px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      console.log(textareaRef.current.scrollHeight);      
  }, [commentText]);

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
    const commentDoc = {
      commentID: uuidv4(),
      photoURL: photoURL,
      text: commentText,
      uid: uid,
      uploadDate: Date.now(),
      username: username
    }
    await updateDoc(postRef, {
      comments: arrayUnion(commentDoc)
    });
    if (params.postID === undefined) {
      setNewComments([...newComments, commentDoc])      
    } else {
      const photoArray = [];
      const profilePhotoData = query(collection(db, 'photoUploads'), 
        where('postID', '==', postID), orderBy('index'));
      const profileImageDataSnap = await getDocs(profilePhotoData);
      profileImageDataSnap.forEach((doc) => {
        photoArray.push(doc.data());
      });
      const profilePostDocument = doc(db, 'postUploads', postID);
      const postSnap = await getDoc(profilePostDocument);

      setSelectedPost([postSnap.data(), ...photoArray]);
      postCommentsRef.current.scrollTop = postCommentsRef.current.scrollHeight;
    }
    setCommentText('');
    setIsSaving(false);
  };

  const enterKeyHandler = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      postComment();
    };
  }

  return (
    <section className='post-comment'>
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
      <button className='emoji-menu-button'>
        <svg aria-label="Emoji" className="emjoi-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
          <path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path>
        </svg>
      </button>
      <form className='post-comment-form'>
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
  )
}

export default PostComments;