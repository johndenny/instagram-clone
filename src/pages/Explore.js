import { getFirestore, query, collection, getDocs, limit, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { useNavigate, useLocation } from "react-router-dom";
import './Explore.css';
import PhotoGrid from "../components/PhotoGrid";

const db = getFirestore();

const Explore = (props) => {
  const {
    getPhotoURLs,
    isMobile,
    getPostData,
    setIsLoadingPage,
    setBackgroundLocation
  } = props;
  const [postsArray, setPostsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getExplorePosts = async (user) => {
    setIsLoading(true);
    const postArray = [];
    const postData = query(collection(db, 'postUploads'), orderBy('uploadDate', 'desc'), limit(25)); 
    const explorePostSnapshot = await getDocs(postData);
    explorePostSnapshot.forEach((post) => {
      let newPost = getPhotoURLs(post.data());
      postArray.push(newPost);
    })
    Promise.all(postArray).then((posts) => {
      setPostsArray(posts);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getExplorePosts();
  },[]);

  return (
    <div className="explore-page">
      {isLoading &&
        <div className='explore-spinner-wrapper'>
          <svg aria-label="Loading..." className='spinner explore' viewBox="0 0 100 100">
            <rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47">
            </rect>
            <rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47">
            </rect>
          </svg> 
        </div>      
      }
      {postsArray.length !== 0 &&
        <PhotoGrid
          isMobile = {isMobile}
          getPostData = {getPostData}
          setIsLoadingPage = {setIsLoadingPage}
          setBackgroundLocation = {setBackgroundLocation}
          postsArray = {postsArray}
        />
      }

    </div>
  )
}

export default Explore;