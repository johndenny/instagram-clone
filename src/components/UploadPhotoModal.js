import './UploadPhotoModal.css';
import { useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import AspectRatioMenu from './AspectRatioMenu';

const UploadPhotoModal = (props) => {
  const {
    setPhotoUploadModalOpen,
    setDiscardPostModalOpen,
  } = props;
  const [width, height] = useWindowSize();
  const [modalWidth, setModalWidth] = useState('');
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [filesDraggedOver, setFilesDraggedOver] = useState(false);
  const [photoUpload, setPhotoUpload] = useState('');
  const [cropMenuOpen, setCropMenuOpen] = useState(false);
  const [cropSelection, setCropSelection] = useState('one-one');

  useEffect(() => {
    console.log('crop:', cropSelection);
  }, [cropSelection]);

  const modalWidthHandler = () => {
    const newWidth = width - 372;
    if (newWidth > 855) {
      setModalWidth(855);
    } else
    setModalWidth(newWidth);
  }

  useEffect(() => {
    modalWidthHandler();
  }, [width]);

  const PhotoSquareFill = () => {
    const url = photoUpload[0];
    const image = new Image();
    image.src = url;
    image.onload = () => {
      const {width, height} = image;
      const aspectRatio = width/height;
      const flippedAspectRatio = height/width;
      let newHeight;
      let newWidth;
      if (aspectRatio > 1) {
        newHeight = modalWidth;
        newWidth = modalWidth * aspectRatio;
      } else {
        newWidth = modalWidth;
        newHeight = modalWidth * flippedAspectRatio;
      }
      setImageWidth(newWidth);
      setImageHeight(newHeight);
    };
  };

  const closeUploadModal = () => {
    if (photoUpload !== '') {
      setDiscardPostModalOpen(true);
    } else {
      setPhotoUploadModalOpen(false);
    }
  };

  const stopBubbles = (event) => {
    event.stopPropagation();
  };

  const dropHandler = (event) => {
    event.preventDefault();
    const { items } = event.dataTransfer;
    let photoArray = [];
    for (let i = 0; i < items.length; i++) {
      const url = URL.createObjectURL(items[i].getAsFile());
      photoArray.push(url);
    }
    setPhotoUpload(photoArray);
    setFilesDraggedOver(false);
  };

  const buttonFileHandler = (event) => {
    const { files } = event.target;
    let photoArray = [];
    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]);
      photoArray.push(url);
    }
    setPhotoUpload(photoArray);
  };

  const dragOverHandler = (event) => {
    event.preventDefault();
  };

  const fileDragEnter = () => {
    setFilesDraggedOver(true);
  };

  const fileDragLeave = () => {
    setFilesDraggedOver(false);
  };

  useEffect(() => {
    if (photoUpload.length !== 0) {
      PhotoSquareFill();
    }
  },[photoUpload]);

  return (
    <div className='upload-photo-modal' onDragEnter={fileDragEnter} onDragLeave={fileDragLeave} onClick={closeUploadModal} onDrop={dropHandler} onDragOver={dragOverHandler}>
      <button className={filesDraggedOver ? ['close-upload-modal-button', 'events-off'].join(' ') : 'close-upload-modal-button'}>
        <svg aria-label="Close" className="close-upload-modal-svg" color="#ffffff" fill="#ffffff" height="24" role="img" viewBox="0 0 24 24" width="24">
          <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
          <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
        </svg>
      </button>
      <div className={filesDraggedOver ? ['upload-photo-content', 'events-off'].join(' ') : 'upload-photo-content'} onClick={stopBubbles}>
        <div className='upload-photo-height-wrapper'>
          <div className='upload-photo-content-wrapper'>
            <div className='upload-photo-inner-content-wrapper'>
              <div className='upload-photo-header-wrapper'>
                <div className='upload-photo-back-wrapper'>
                  {imageHeight !== 0 &&
                    <button className='upload-photo-back-button'>
                      <svg aria-label="Back" className="upload-back-svg" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line>
                        <polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
                      </svg>
                    </button>
                  }
                </div>
                <h1 className='upload-photo-title'>
                  {imageHeight !== 0 &&
                    'Crop'
                  }
                  {photoUpload === '' &&
                    'Create new post'
                  }
                  
                </h1>
                <div className='upload-photo-forwards-wrapper'>
                  {imageHeight !== 0 &&
                    <button className='upload-photo-forwards-button'>
                      Next
                    </button>
                  }
                </div>
              </div>
              <div className='editing-content'>
                <div className='photo-editing-wrapper'>
                  {imageHeight !== 0 &&
                    <div className='upload-photo-edit-buttons-wrapper'>
                      <AspectRatioMenu
                        cropSelection={cropSelection}
                        setCropSelection={setCropSelection} 
                        cropMenuOpen={cropMenuOpen}
                        setCropMenuOpen={setCropMenuOpen}
                      />
                      <div className='zoom-button'>

                      </div>
                      <div className='add-photo-gallery-button'>

                      </div>
                      <div className='upload-photo-overflow-frame'>
                        <div 
                          className='uploaded-photo-background' 
                          style={{
                            backgroundImage: `url(${photoUpload[0]})`,
                            height: imageHeight,
                            width: imageWidth,
                          }}
                        ></div>
                      </div>
                    </div>                  
                  }
                  {photoUpload === '' &&
                    <div className='upload-photo-input-wrapper'>
                      <div className='upload-photo-input-area'>
                        <svg aria-label="Icon to represent media such as images or videos" className="upload-photo-videos-svg" color={filesDraggedOver ? "#0095f6" : "#262626"} fill={filesDraggedOver ? "#0095f6" : "#262626"} height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path>
                          <path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path>
                          <path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path>
                        </svg>
                        <h2 className='upload-photo-input-area-text'>
                          Drag photos here
                        </h2>
                        <label htmlFor='photo-upload-input' className='select-from-computer-label'>
                          <button className='select-from-computer-button'>
                            Select from computer
                          </button>                      
                        </label>
                      </div>

                    </div>                    
                  }
                  <form className='photo-upload-input-form'>
                    <input 
                      onChange={buttonFileHandler} 
                      accept='.jpg,.jpeg,.png' 
                      className='photo-upload-input' 
                      id='photo-upload-input' 
                      type='file' 
                      multiple='multiple'
                    />
                  </form>
                </div>
                <div className='photo-editing-tools-wrapper'></div>
              </div>              
            </div>
          </div>          
        </div>
      </div>
    </div>
  )
}

export default UploadPhotoModal;