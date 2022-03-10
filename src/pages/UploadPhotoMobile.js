import { useEffect, useState } from "react";
import './UploadPhotoMobile.css';

const UploadPhotoMobile = (props) => {
  const { mobilePhotoUpload, aspectRatio, flippedAspectRatio } = props;
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [pointerX, setPointerX] = useState(0);
  const [pointerY, setPointerY] = useState(0);
  const [pointerStartXY, setPointerStartXY] = useState({});
  const [imageFitHeight, setImageFitHeight] = useState(true);
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [imageDegrees, setImageDegrees] = useState(0);
  const [originPointY, setOriginPointY] = useState(50);
  const [lastOrginY, setLastOriginY] = useState(50);
  const [originPointX, setOriginPointX] = useState(50);
  const [lastOrginX, setLastOriginX] = useState(50);
  const [imageFlipped, setImageFlipped] = useState(false);
  const [imageOrientation, setImageOrientation] = useState('horizontal-up')
  const shortestImageRatio = 1080/565;
  const widestImageRatio = 1080/1350;

  const pointerStart = (event) => {
    const x = event.screenX
    const y = event.screenY
    setPointerStartXY({ 
      x: x, 
      y: y
    });
  }

  const pointerTracker = (event) => {
    console.log(imageX,imageY);
    let x;
    let y;
    if (imageOrientation === 'vertical-up') {
      y = (pointerStartXY.x - event.screenX) * -1;
      x = (pointerStartXY.y - event.screenY);
    } else if (imageOrientation === 'horizontal-down') {
      x = (pointerStartXY.x - event.screenX);
      y = (pointerStartXY.y - event.screenY);
    } else if (imageOrientation === 'vertical-down') {
      y = (pointerStartXY.x - event.screenX);
      x = (pointerStartXY.y - event.screenY) * -1;
    } else {
      x = (pointerStartXY.x - event.screenX) * -1;
      y = (pointerStartXY.y - event.screenY) * -1;  
    }
    console.log("x: ", (pointerStartXY.x - event.screenX), "y: ", (pointerStartXY.y - event.screenY));
    if (imageFitHeight) {
      setPointerX((x/4) + imageX);
      setPointerY((y/4) + imageY);
      console.log((x/4) + imageX);
      console.log(((y/4) + imageY) / (imageHeight / 2) * 50);
      setOriginPointX(lastOrginX - (((y/4) / (imageHeight / 2)) * 50));
      setOriginPointY(lastOrginY - (((x/4) / (imageWidth / 2)) * 50));    
    }
  };

  const imageLocationHandler = () => {
    if (imageFitHeight) {
      if (pointerY !== 0) {
        setPointerY(0);
        setImageY(0);
        setLastOriginX(50);
        setOriginPointX(50);
      }
      if (pointerX <= ((aspectRatio * 100) - 100) * -1) {
        setPointerX(((aspectRatio * 100) - 100) * -1);
        setImageX(((aspectRatio * 100) - 100) * -1);
        setOriginPointY(50 + ((((imageWidth - 100) / 2) / (imageWidth / 2)) * 50));
        setLastOriginY(50 + ((((imageWidth - 100) / 2) / (imageWidth / 2)) * 50));
        return
      }
    }
    if (pointerX >= 0) {
      setPointerX(0);
      setImageX(0);
      setOriginPointY(50 - ((((imageWidth - 100) / 2) / (imageWidth / 2)) * 50));
      setLastOriginY(50 - ((((imageWidth - 100) / 2) / (imageWidth / 2)) * 50));
      return
    }
    setImageX(pointerX);
    setLastOriginY(originPointY);
  }

  const verticalImageHandler = () => {
    if (imageFitHeight) {
      if (pointerX !== 0) {
        setPointerX(0);
        setImageX(0);
        setLastOriginY(50);
        setOriginPointY(50);
      }
      if (pointerY <= ((flippedAspectRatio * 100) - 100) * -1) {
        setPointerY(((flippedAspectRatio * 100) - 100) * -1);
        setImageY(((flippedAspectRatio * 100) - 100) * -1);
        setOriginPointX(50 + ((((imageHeight - 100) / 2) / (imageHeight / 2)) * 50));
        setLastOriginX(50 + ((((imageHeight - 100) / 2) / (imageHeight / 2)) * 50));
        return
      }
    }
    if (pointerY >= 0) {
      setPointerY(0);
      setImageY(0);
      setOriginPointX(50 - ((((imageHeight - 100) / 2) / (imageHeight / 2)) * 50));
      setLastOriginX(50 - ((((imageHeight - 100) / 2) / (imageHeight / 2)) * 50));
      return
    }
    setImageY(pointerY);
    setLastOriginX(originPointX);
  }

  const centerImage = () => {
    const percent = (((aspectRatio * 100) - 100) / 2) * -1;
    const verticalPercent = (((flippedAspectRatio * 100) - 100) / 2) * -1;
    if (aspectRatio < 1) {
      console.log('vertical')
      setImageX(0);
      setPointerX(0);
      setPointerY(verticalPercent);
      setImageY(verticalPercent);
    } 
    if (aspectRatio > 1) {
      console.log('horizontal');
      setPointerY(0);
      setImageY(0);    
      setPointerX(percent);
      setImageX(percent);
    }
  }

  const toggleImageFit = () => {
    if (!imageFitHeight) {
      setImageFitHeight(true)
      const percent = (((aspectRatio * 100) - 100) / 2) * -1;
      setPointerX(percent);
      setImageX(percent);
      setPointerY(0);
      setImageY(0);
    } else {
      setImageFitHeight(false);
      let percent;
      if (flippedAspectRatio * 100 < 52.356) {
        percent = (((shortestImageRatio * 100) - 100) / 4);
        setPointerX((((aspectRatio * 52.356) - 100) / 2) * -1);
        setImageX((((aspectRatio * 52.356) - 100) / 2) * -1);
        setPointerY(percent);
        setImageY(percent);
      } else {
        percent = (((flippedAspectRatio * 100) - 100) / 2) * -1;
        setPointerX(0);
        setImageX(0);
        setPointerY(percent);
        setImageY(percent);
      }
    }
    setLastOriginX(50);
    setOriginPointX(50);
    setLastOriginY(50);
    setOriginPointY(50);
  };

  const verticalToggleFit = () => {
    console.log(imageFitHeight);
    if (!imageFitHeight) {
      setImageFitHeight(true);
      const verticalPercent = (((flippedAspectRatio * 100) - 100) / 2) * -1;
      setPointerX(0);
      setImageX(0);
      setPointerY(verticalPercent);
      setImageY(verticalPercent);
    } else {
      setImageFitHeight(false);
      let percent;
      if (aspectRatio * 100 < 80) {
        console.log('too-big')
        percent = 10;
        setPointerY((((flippedAspectRatio * 80) - 100) / 2) * -1);
        setImageY((((flippedAspectRatio * 80) - 100) / 2) * -1);
        setPointerX(percent);
        setImageX(percent);
      } else {
        percent = ((aspectRatio * 100) - 100) / 2;
        setPointerY(0);
        setImageY(0)
        setPointerX(percent);
        setImageX(percent);
      }
    }
    setLastOriginX(50);
    setOriginPointX(50);
    setLastOriginY(50);
    setOriginPointY(50);
  }

  const imageHandler = () => {
    console.log(aspectRatio);
    if (aspectRatio < 1) {
      if (!imageFitHeight) {
        if (imageFlipped) {
          console.log('flipped');
          const imageWidth = (aspectRatio * 100) < 52.356 ? 52.356 : ((aspectRatio * 100));
          setImageHeight((aspectRatio * 100) < 52.356 ? aspectRatio * 52.356 : 100);
          setImageWidth(imageWidth);
          setPointerY(0);
          setImageY(0);
          setPointerX((100 - imageWidth) / 2);
          setImageX((100 - imageWidth) / 2);
          setOriginPointX(50);
          setLastOriginX(50);
          setOriginPointY(50);
          setLastOriginY(50);
          return
        }
        let percent;
        if (aspectRatio * 100 < 80) {
          console.log('too-big')
          percent = 10;
          setPointerY((((flippedAspectRatio * 80) - 100) / 2) * -1);
          setImageY((((flippedAspectRatio * 80) - 100) / 2) * -1);
          setPointerX(percent);
          setImageX(percent);
        } else {
          percent = ((aspectRatio * 100) - 100) / 2;
          setPointerY(0);
          setImageY(0)
          setPointerX(percent);
          setImageX(percent);
        }
        setImageHeight((aspectRatio * 100) < 80 ? flippedAspectRatio * 80 : 100);
        setImageWidth((aspectRatio * 100) < 80 ? 80 : (aspectRatio * 100));
        return
      }
      setImageWidth(100)
      setImageHeight((flippedAspectRatio * 100));
      return
    } 
    if (aspectRatio > 1) {
      if (!imageFitHeight) {
        if (imageFlipped) {
          console.log('flipped');
          console.log(aspectRatio, flippedAspectRatio);
          const imageWidth = 80;
          setImageWidth(aspectRatio * 80);
          setImageHeight(imageWidth);
          setPointerY(10);
          setImageY(10);
          setPointerX((100 - (aspectRatio * 80)) / 2);
          setImageX((100 - (aspectRatio * 80)) / 2)
          setOriginPointX(50);
          setLastOriginX(50);
          setOriginPointY(50);
          setLastOriginY(50);
          return
        }
        let percent;
        if (flippedAspectRatio * 100 < 52.356) {
          percent = (((shortestImageRatio * 100) - 100) / 4);
          setPointerX((((aspectRatio * 52.356) - 100) / 2) * -1);
          setImageX((((aspectRatio * 52.356) - 100) / 2) * -1);
          setPointerY(percent);
          setImageY(percent);
        } else {
          percent = (((flippedAspectRatio * 100) - 100) / 2) * -1;
          setPointerX(0);
          setImageX(0);
          setPointerY(percent);
          setImageY(percent);
        }
        setImageWidth((flippedAspectRatio * 100) < 52.356 ? aspectRatio * 52.356 : 100);
        setImageHeight((flippedAspectRatio * 100) < 52.356 ? 52.356 : (flippedAspectRatio * 100));
        return
      }
      setImageWidth((aspectRatio * 100));
      setImageHeight(100)
    }
  }

  const imageLoad = () => {
    console.log(aspectRatio);
    if (aspectRatio < 1) {
      setImageWidth(100)
      setImageHeight((flippedAspectRatio * 100));
      return
    } 
    if (aspectRatio > 1) {
      setImageWidth((aspectRatio * 100));
      setImageHeight(100)
    }
  }

  const imageRotate = () => {
    setImageDegrees(imageDegrees - 90);
    imageFlipped ? setImageFlipped(false) : setImageFlipped(true);
    if (imageOrientation === 'horizontal-up') {
      setImageOrientation('vertical-up');
    }
    if (imageOrientation === 'vertical-up') {
      setImageOrientation('horizontal-down');
    }
    if (imageOrientation === 'horizontal-down') {
      setImageOrientation('vertical-down');
    }
    if (imageOrientation === 'vertical-down') {
      setImageOrientation('horizontal-up');
    }
  }

  useEffect(() => {
    imageHandler();
  }, [imageFitHeight]);

  useEffect(() => {
    if (!imageFitHeight) {
      imageHandler();
    };
  }, [imageFlipped]);

  useEffect(() => {
    centerImage();
    imageLoad();
  },[aspectRatio, flippedAspectRatio]);

  return (
    <section className="mobile-photo-upload-editor">
      <div className="photo-overflow-frame" 
        onPointerMove={pointerTracker} 
        onPointerDown={pointerStart} 
        onPointerUp={(aspectRatio < 1) ? verticalImageHandler : imageLocationHandler}
      >
        <div className="photo-padding-wrapper">
          <div className="photo-background-wrapper">
              <div className="uploaded-photo" 
                style={{ 
                  backgroundImage: `url(${mobilePhotoUpload})`, 
                  top: `${pointerY}%`, 
                  left: `${pointerX}%`, 
                  width: `${imageWidth}%`,
                  height: `${imageHeight}%`,
                  transform: `rotate(${imageDegrees}deg)`,
                  transformOrigin: `${originPointY}% ${originPointX}%`,
                }}>
              </div>
            {imageFitHeight &&
              <div className="photo-grid">
                <div className="grid-line vertical-left"></div>
                <div className="grid-line vertical-right"></div>
                <div className="grid-line horizontal-top"></div>
                <div className="grid-line horizontal-bottom"></div>  
              </div>            
            }
            <button className="fit-button" onClick={(aspectRatio < 1) ? verticalToggleFit : toggleImageFit}>
              <span className="fit-button-sprite"></span>  
            </button>
            <button className="rotate-button" onClick={imageRotate}>
              <span className="rotate-button-sprite"></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UploadPhotoMobile;