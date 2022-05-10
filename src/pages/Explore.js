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

  const getExplorePosts = async (user) => {
    const postArray = [];
    const postData = query(collection(db, 'postUploads'), orderBy('uploadDate', 'desc'), limit(25)); 
    const explorePostSnapshot = await getDocs(postData);
    explorePostSnapshot.forEach((post) => {
      let newPost = getPhotoURLs(post.data());
      postArray.push(newPost);
    })
    Promise.all(postArray).then((posts) => {
      setPostsArray(posts);
    });
  };

  useEffect(() => {
    getExplorePosts();
  },[]);

  return (
    <div className="explore-page">
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