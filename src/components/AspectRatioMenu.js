import { useState } from 'react';
import './AspectRatioMenu.css';

const AspectRatioMenu = (props) => {
  const {
    cropSelection,
    setCropSelection, 
    cropMenuOpen,
    setCropMenuOpen, 
  } = props;
  const [animateMenu, setAnimateMenu] = useState(false);

  const hideMenu = () => {
    if (animateMenu) {
      setCropMenuOpen(false);
      setAnimateMenu(false);
    }
  }

  const toggleMenu = () => {
    if (!cropMenuOpen) {
      setCropMenuOpen(true);
    } else {
      setAnimateMenu(true);
    }
  };

  const original = () => {
    setCropSelection('original');
  }
  const oneToOne = () => {
    setCropSelection('one-one');
  }
  const fourToFive = () => {
    setCropSelection('four-five');
  }
  const sixteenToNine = () => {
    setCropSelection('sixteen-nine');
  }

  return (
    <div className='aspect-ratio-button-menu'>
      {cropMenuOpen &&
        <div 
          className={animateMenu ? ['aspect-ratio-menu-wrapper', 'slideDown'].join(' ') : 'aspect-ratio-menu-wrapper'}
          onAnimationEnd={hideMenu}
        >
          <button className='original-button' onClick={original}>
            <div className='aspect-ratio-inner-button'>
              <span 
                className={(cropSelection === 'original') ? ['inner-button-text', 'selected'].join(' ') : 'inner-button-text'}
              >
                Original
              </span>
              <svg aria-label="Photo Outline Icon" className="orginal-svg" color={(cropSelection === 'original') ? '#ffffff' : "#8e8e8e"} fill={(cropSelection === 'original') ? '#ffffff' : "#8e8e8e"} height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M6.549 5.013A1.557 1.557 0 108.106 6.57a1.557 1.557 0 00-1.557-1.557z" fillRule="evenodd"></path>
                <path d="M2 18.605l3.901-3.9a.908.908 0 011.284 0l2.807 2.806a.908.908 0 001.283 0l5.534-5.534a.908.908 0 011.283 0l3.905 3.905" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M18.44 2.004A3.56 3.56 0 0122 5.564h0v12.873a3.56 3.56 0 01-3.56 3.56H5.568a3.56 3.56 0 01-3.56-3.56V5.563a3.56 3.56 0 013.56-3.56z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
          </button>
          <hr className='aspect-ratio-divider'></hr>
          <button className='one-to-one-button' onClick={oneToOne}>
            <div className='aspect-ratio-inner-button'>
            <span 
                className={(cropSelection === 'one-one') ? ['inner-button-text', 'selected'].join(' ') : 'inner-button-text'}
              >
                1:1
              </span>
              <svg aria-label="Crop Square Icon" className="one-to-one-svg" color={(cropSelection === 'one-one') ? '#ffffff' : "#8e8e8e"} fill={(cropSelection === 'one-one') ? '#ffffff' : "#8e8e8e"} height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M19 23H5a4.004 4.004 0 01-4-4V5a4.004 4.004 0 014-4h14a4.004 4.004 0 014 4v14a4.004 4.004 0 01-4 4zM5 3a2.002 2.002 0 00-2 2v14a2.002 2.002 0 002 2h14a2.002 2.002 0 002-2V5a2.002 2.002 0 00-2-2z"></path>
              </svg>
            </div>
          </button>
          <hr className='aspect-ratio-divider'></hr>
          <button className='four-to-five-button' onClick={fourToFive}>
            <div className='aspect-ratio-inner-button'>
            <span 
                className={(cropSelection === 'four-five') ? ['inner-button-text', 'selected'].join(' ') : 'inner-button-text'}
              >
                4:5
              </span>
              <svg aria-label="Crop Portrait Icon" className="four-to-five-svg" color={(cropSelection === 'four-five') ? '#ffffff' : "#8e8e8e"} fill={(cropSelection === 'four-five') ? '#ffffff' : "#8e8e8e"} height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M16 23H8a4.004 4.004 0 01-4-4V5a4.004 4.004 0 014-4h8a4.004 4.004 0 014 4v14a4.004 4.004 0 01-4 4zM8 3a2.002 2.002 0 00-2 2v14a2.002 2.002 0 002 2h8a2.002 2.002 0 002-2V5a2.002 2.002 0 00-2-2z"></path>
              </svg>
            </div>
          </button>
          <hr className='aspect-ratio-divider'></hr>
          <button className='sixteen-to-nine-button' onClick={sixteenToNine}>
            <div className='aspect-ratio-inner-button'>
            <span 
                className={(cropSelection === 'sixteen-nine') ? ['inner-button-text', 'selected'].join(' ') : 'inner-button-text'}
              >
                16:9
              </span>
              <svg aria-label="Crop Landscape Icon" className="sixteen-to-nine-svg" color={(cropSelection === 'sixteen-nine') ? '#ffffff' : "#8e8e8e"} fill={(cropSelection === 'sixteen-nine') ? '#ffffff' : "#8e8e8e"} height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M19 20H5a4.004 4.004 0 01-4-4V8a4.004 4.004 0 014-4h14a4.004 4.004 0 014 4v8a4.004 4.004 0 01-4 4zM5 6a2.002 2.002 0 00-2 2v8a2.002 2.002 0 002 2h14a2.002 2.002 0 002-2V8a2.002 2.002 0 00-2-2z"></path>
              </svg>
            </div>
          </button>
        </div>      
      }
      <div className={cropMenuOpen ? ["aspect-ratio-button-wrapper", "selected"].join(' ') : "aspect-ratio-button-wrapper"}>
        <button className="aspect-ratio-button" onClick={toggleMenu}>
          <div className='aspect-ratio-button-inner'>
            <svg aria-label="Select Crop" className="aspect-ratio-svg" color={cropMenuOpen ? "#262626" : "#ffffff"} fill={cropMenuOpen ? "#262626" : "#ffffff"} height="16" role="img" viewBox="0 0 24 24" width="16">
              <path d="M10 20H4v-6a1 1 0 00-2 0v7a1 1 0 001 1h7a1 1 0 000-2zM20.999 2H14a1 1 0 000 2h5.999v6a1 1 0 002 0V3a1 1 0 00-1-1z"></path>
            </svg>            
          </div>
        </button>
      </div>
    </div>
  );
};

export default AspectRatioMenu;