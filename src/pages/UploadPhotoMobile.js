import { useEffect, useRef, useState } from "react";
import './UploadPhotoMobile.css';
import { useNavigate } from "react-router-dom";

const UploadPhotoMobile = (props) => {
  const navigate = useNavigate();
  const { mobilePhotoUpload, aspectRatio, flippedAspectRatio, setMobilePhotoUpload } = props;
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
  const [editorPage, setEditorPage] = useState('edit');
  const canvasRef = useRef(null);
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

  useEffect(() => () => setMobilePhotoUpload(''), []);

  useEffect(() => {
    resizeImage();
  }, [imageLoad]);

  const editPageToggle = () => {
    editorPage === 'edit' ? setEditorPage('filter') : setEditorPage('edit');
  }

  const resizeImage = () => {
    const img = new Image();
    img.onload = () => {
        canvas_scale(img)    
    };
    img.src = mobilePhotoUpload;
  }

  function canvas_scale(img) {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d");

    if (imageFitHeight) {
      canvas.width = 1080;
      canvas.height = 1080;
    }
    if (!imageFitHeight && !imageFlipped && (aspectRatio > 1)) {
      console.log('hello')
      canvas.width = 1080;
      const height = canvas.width * flippedAspectRatio;
      if (height < 565) {
        canvas.height = 565;
      } else {
        canvas.height = canvas.width * flippedAspectRatio;        
      }
    }
    if (!imageFitHeight && !imageFlipped && (aspectRatio < 1)) {
      canvas.width = 1080;
      const height = canvas.width * flippedAspectRatio
      if (height > 1350) {
        canvas.height = 1350
      } else {
        canvas.height = canvas.width * flippedAspectRatio;        
      }
    }
    if (!imageFitHeight && imageFlipped && (aspectRatio > 1)) {
      canvas.width = 1080;
      const height = canvas.width * aspectRatio;
      if (height > 1350) {
        canvas.height = 1350;
      } else {
        canvas.height = canvas.width * aspectRatio;        
      };
    };
    if (!imageFitHeight && imageFlipped && (aspectRatio < 1)) {
      canvas.width = 1080;
      const height = canvas.width * aspectRatio;
      if (height < 565) {
        canvas.height = 565;
      } else {
        canvas.height = canvas.width * aspectRatio;
      };
    };

    ctx.globalCompositeOperation = 'destination-under';
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const ratio = img.width / img.height;
    let newWidth = canvas.width;
    let newHeight = newWidth / ratio;
    if (!imageFitHeight && imageFlipped && (aspectRatio < 1)) {
      newHeight = canvas.width;
      newWidth = canvas.width * ratio;    
    }
    if (newHeight < canvas.height) {
      if (imageFlipped && (aspectRatio > 1)) {
        newHeight = canvas.width;
        newWidth = canvas.width * ratio;    
      }    
      if (!imageFlipped) {
        newHeight = canvas.height;
        newWidth = newHeight * ratio;        
      }
    }

    let xOffset;
    let yOffset;
    if (imageFitHeight) {
      xOffset = (newHeight * (pointerX / 100));
      yOffset = (newWidth * (pointerY / 100));   
    }   
    if (!imageFitHeight && (aspectRatio > 1)) {
      xOffset = newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0;
      yOffset = newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
    }
    if (!imageFitHeight && (aspectRatio < 1)) {
      xOffset = newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0;
      yOffset = newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
    }
    if (!imageFitHeight && imageFlipped && (aspectRatio > 1)) {
      xOffset = (canvas.height - newWidth) / 2;
      yOffset = newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
    }
    if (!imageFitHeight && imageFlipped && (aspectRatio < 1)) {
      console.log('hello!')
      xOffset = (canvas.height - newWidth) / 2;
      yOffset = newHeight > canvas.width ? (canvas.height - newHeight) / 2 : 0;
    }


    console.log('yOffset:', yOffset, 'xOffset:', xOffset);

    console.log('canvas:', xOffset, pointerY, 'new:', newWidth, newHeight)
    switch (true) {
      case imageOrientation === 'vertical-up':
        if (!imageFitHeight) {
          ctx.translate(0, canvas.height);
        } else {
          ctx.translate(0, canvas.width);
        };
        break;
      case imageOrientation === 'horizontal-down':
        if (!imageFitHeight) {
          if (newWidth > canvas.width) {
            ctx.translate(newWidth - (newWidth - canvas.width), newHeight);
          } else if (newHeight > canvas.height) {
            ctx.translate(newWidth, newHeight - (newHeight - canvas.height))
          } else {
            ctx.translate(newWidth, newHeight);
          };
        };
        if (imageFitHeight) {
          ctx.translate(canvas.height, canvas.width);
        }
        break;
      case imageOrientation === 'vertical-down':
        if (!imageFitHeight) {
          ctx.translate(canvas.width, 0);
        } else {
          ctx.translate(canvas.height, 0);
        }
        break;
      default: 
    }
    ctx.rotate(imageDegrees * Math.PI / 180);
    ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
    

    // canvas.toBlob((blob) => {
    //   const image = new Image();
    //   image.src = blob;
    //   uploadPhoto(blob);
    // });
  }

  useEffect(() => {
    resizeImage();
  }, [pointerX, pointerY]);

  const [canvasWrapperClass, setCanvasWrapperClass] = useState([]);
  const [canvasClass, setCanvasClass] = useState([]);

  const photoCanvasWrapperClass = () => {  
    if (!imageFitHeight && !imageFlipped && (aspectRatio < 1)) {
      setCanvasWrapperClass(["photo-canvas-wrapper", "vertical-fitted"]);
      setCanvasClass(["photo-canvas", "vertical-fitted"]);
      return
    }
    if (!imageFitHeight && imageFlipped && (aspectRatio > 1)) {
      setCanvasClass(['photo-canvas', "vertical-fitted"]);
      setCanvasWrapperClass(['photo-canvas-wrapper', "vertical-fitted"]);
      return
    }
    setCanvasClass(['photo-canvas']);
    setCanvasWrapperClass(['photo-canvas-wrapper']);
  };

  useEffect(() => {
    photoCanvasWrapperClass()
    console.log("wrapper:", canvasWrapperClass, "canvas-class:", canvasClass);
  },[imageFitHeight, imageFlipped]);

  return (
    <section className="mobile-photo-upload-editor">
      <header className="new-post-header">
        <div className="header-content-wrapper">
          <button className="close-new-post-button" onClick={() => navigate(-1)}>
            <svg aria-label="Close" className="close-post-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="3" y2="21"></line>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="21" y2="3"></line>
            </svg>
          </button>
          <h1 className="new-post-header-text">New Photo Post</h1>
          <button className="next-new-post-button">Next</button>
        </div>
      </header>
      <div className={editorPage === 'edit' ? ["photo-canvas-preview", 'hidden'].join(' ') : 'photo-canvas-preview'}>
        <div className="photo-canvas-padding-wrapper">
          <div className={canvasWrapperClass.join(' ')}>
            <canvas className={canvasClass.join(' ')} ref={canvasRef} width='1080' height='1080'></canvas>
          </div>
        </div>
      </div>
      <div className={editorPage === 'filter' ? ["photo-overflow-frame", 'hidden'].join(' ') : 'photo-overflow-frame'} 
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
      <div className="editor-selection-tabs">
        <div className="button-tab-wrapper">
          <button className={editorPage === 'filter' ? ["filter-edit-button", 'selected'].join(' ') : 'filter-edit-button'} onClick={editPageToggle}>
            <div className="filter-button-inner-text">
              Filter
            </div>
          </button>
          <button className={editorPage === 'edit' ? ['edit-photo-button', 'selected'].join(' ') : "edit-photo-button"} onClick={editPageToggle}>
            <div className="edit-button-inner-text">
              Edit
            </div>
          </button>    
        </div>
      </div>
    </section>
  )
}

export default UploadPhotoMobile;