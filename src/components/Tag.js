import './Tag.css';
import { useLayoutEffect, useRef, useState } from 'react';

const Tag = (props) => {
  const {
    setIsMoved,
    isMoved,
    imageDimensions,
    index,
    setTagData,
    tagData,
    imageRef,
    left,
    top,
    username,
  } = props;
  const tagRef = useRef();
  const [tagTabLeft, setTagTabLeft] = useState(50);
  const [tagTabTop, setTagTabTop] = useState(0);
  const [tagLeft, setTagLeft] = useState(50);
  const [isTagTapped, setIsTaggedTapped] = useState(false);

  const onTouchEnd = () => {
    console.log('end')
    if (isMoved) {
      setIsMoved(false);
    } else {
      isTagTapped 
        ? setIsTaggedTapped(false) 
        : setIsTaggedTapped(true);
    }
  }

  const tagOrientationHandler = () => {
    const tag = tagRef.current.getBoundingClientRect();
    const {
      width,
      height,
    } = imageDimensions;
    const tagWidthOverflow = ((tag.width / width) * 100) / 2;
    const tagHeightOverflow = ((tag.height / height) * 100);
    const tagSizeMultiplyer = width / tag.width;
    const leftUpperBoundery = 100 - (tagWidthOverflow + 2.5);
    const leftLowerBoundery = tagWidthOverflow + 2.5;
    if (left >= leftUpperBoundery) {
      const percentOverBoundery = left - leftUpperBoundery;
      const newLeft = 50 + (percentOverBoundery * tagSizeMultiplyer);
      setTagLeft(newLeft);
      if (newLeft > 85) {
        setTagTabLeft(85);
      } else {
        setTagTabLeft(newLeft);
      }
    } else if (left <= leftLowerBoundery){
      const percentUnderBoundery = leftLowerBoundery - left;
      const newLeft = 50 - (percentUnderBoundery * tagSizeMultiplyer);
      setTagLeft(newLeft);
      if (newLeft < 15) {
        setTagTabLeft(15);
      } else {
        setTagTabLeft(newLeft);
      }
    } else {
      setTagTabLeft(50);
    }
    if (top >= (100 - tagHeightOverflow - 5)) {
      setTagTabTop(100);
    } else {
      setTagTabTop(0);
    }
  }

  const deleteTag = (event) => {
    console.log('delete');
    event.stopPropagation();
    const newData = [...tagData];
    newData.splice(index, 1);
    setTagData(newData);
  }

  useLayoutEffect(() => {
    if (imageDimensions !== null) {
      tagOrientationHandler();
    }
  }, [tagData]);

  return (
    <div 
      className={tagTabTop === 100 ? 'photo-tag flipped' : 'photo-tag'}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: `translate(-${tagLeft}%, -${tagTabTop}%)`
      }}
      ref={tagRef}
      onTouchEnd={onTouchEnd}
    >
      <div 
        className={tagTabTop === 100 ? 'photo-tag-tab flipped' : 'photo-tag-tab'}
        style={{
          left: `${tagTabLeft}%`
        }}
      ></div>
      <span className='photo-tag-username'>
        {username}
      </span>
      {isTagTapped && !isMoved &&
        <span 
          className='photo-tag-delete-sprite'
          onTouchEnd={deleteTag}
        >
        </span>      
      }
    </div>
  )
};

export default Tag;