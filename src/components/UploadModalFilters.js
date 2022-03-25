import normal from '../images/filters/normal.jpg';
import clarendon from '../images/filters/clarendon.jpg';
import gingham from '../images/filters/gingham.jpg';
import moon from '../images/filters/moon.jpg';
import lark from '../images/filters/lark.jpg';
import reyes from '../images/filters/reyes.jpg';
import juno from '../images/filters/juno.jpg';
import slumber from '../images/filters/slumber.jpg';
import crema from '../images/filters/crema.jpg';
import ludwig from '../images/filters/crema.jpg';
import aden from '../images/filters/aden.jpg';
import perpetua from '../images/filters/perpetua.jpg';
import React, { useEffect, useRef, useState } from 'react';
import './UploadModalFilters.css'

const UploadModalFilters = () => {

  const [currentFilterPage, setCurrentFilterPage] = useState('filters');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [filterFadeValue, setFilterFadeValue] = useState(100);
  const [brightnessValue, setBrightnessValue] = useState('0');
  const [contrastValue, setContrastValue] = useState('0');
  const [saturationValue, setSaturationValue] = useState('0');
  const [temperatureValue, setTemperatureValue] = useState('0');
  const [fadeValue, setFadeValue] = useState('0');
  const [vignetteValue, setVignetteValue] = useState('0');
  const canvasRef = useRef(null);
  const adjustments = [
    {
      title: 'brightness', 
      state: brightnessValue,
      valueHandler(event) {
        const { value } = event.target;
        setBrightnessValue(value);
      },
      resetValue() {
        setBrightnessValue('0');
      },
    },
    {
      title: 'contrast', 
      state: contrastValue, 
      valueHandler(event) {
        const { value } = event.target;
        setContrastValue(value);
      },
      resetValue() {
        setContrastValue('0');
      }
    },
    {
      title: 'saturation', 
      state: saturationValue, 
      valueHandler(event) {
        const { value } = event.target;
        setSaturationValue(value);
      },
      resetValue() {
        setSaturationValue('0');
      }
    },
    {
      title: 'temperature', 
      state: temperatureValue, 
      valueHandler(event) {
        const { value } = event.target;
        setTemperatureValue(value);
      },
      resetValue() {
        setTemperatureValue('0');
      }
    },
    {
      title: 'fade', 
      state: fadeValue, 
      valueHandler(event) {
        const { value } = event.target;
        setFadeValue(value);
      },
      resetValue() {
        setFadeValue('0');
      }
    },
    {
      title: 'vignette', 
      state: vignetteValue, 
      valueHandler(event) {
        const { value } = event.target;
        setVignetteValue(value);
      },
      resetValue() {
        setVignetteValue('0');
      }
    },
  ]
  const filters = [
    {
      image: normal, 
      title: 'normal'
    },
    {
      image: clarendon, 
      title: 'clarendon'
    }, 
    {
      image: gingham, 
      title: 'gingham'
    },
    {
      image: moon, 
      title: 'moon'
    },
    {
      image: lark, 
      title: 'lark'
    },
    {
      image: reyes, 
      title: 'reyes'
    },
    {
      image: juno, 
      title: 'juno'
    },
    {
      image: slumber, 
      title: 'slumber'
    },
    {
      image: crema, 
      title: 'crema'
    },
    {
      image: ludwig, 
      title: 'ludwig'
    },
    {
      image: aden, 
      title: 'aden'},
    {
      image: perpetua, 
      title: 'perpetua'
    },
  ]

  const filterPageToggle = () => {
    currentFilterPage === 'filters'
      ? setCurrentFilterPage('adjustments')
      : setCurrentFilterPage('filters');
  };

  const filterSelectionHandler = (event) => {
    const { id } = event.target;
    setSelectedFilter(id);
  } 

  const filterFadeHandler = (event) => {
    const { value } = event.target;
    setFilterFadeValue(value);
  }

  const loadCanvasPhoto = () => {

  }

  return (
    <div className='upload-canvas-filters-wrapper'>
      <div className='upload-canvas-wrapper'>
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className='upload-filters-wrapper'>
        <div className='upload-filter-tabs-wrapper'>
          <button 
            className={
              currentFilterPage === 'filters' 
                ? ['upload-filters-button', 'selected'].join(' ') 
                : 'upload-filters-button'
            }
            onClick={filterPageToggle}
          >
            Filters
          </button>
          <button 
            className={
              currentFilterPage === 'adjustments' 
                ? ['upload-adjustments-button', 'selected'].join(' ') 
                : 'upload-adjustments-button'
            }
            onClick={filterPageToggle}
          >
            Adjustments
          </button>
        </div>
        <div className='upload-filter-content'>
          {currentFilterPage === 'filters' &&
            <React.Fragment>
              <div className='upload-filter-grid-wrapper'>
                {filters.map((filter) => {
                  const {
                    image,
                    title,
                  } = filter
                  return (
                    <button 
                      key={title} 
                      className={
                        selectedFilter === title 
                          ? [`upload-filter-button-${title}`, 'selected'].join(' ') 
                          : `upload-filter-button-${title}`
                      } 
                      id={title}
                      onClick={filterSelectionHandler}
                    >
                      <div className='upload-filter-image-wrapper'>
                        <img alt={`Filter: ${title}`} className='upload-filter-image' id={title} src={image} />                      
                      </div>
                      <span id={title} className='upload-filter-title' >
                        {title}  
                      </span> 
                    </button>
                  )
                })}
              </div>

            </React.Fragment>          
          }
          {currentFilterPage === 'adjustments' &&
            <div className='upload-filter-adjustments-wrapper'>
              {adjustments.map((adjustment) => {
                const {
                  title,
                  state,
                  valueHandler,
                  resetValue,
                } = adjustment
                return (
                  <div
                    key={title}
                    className='filter-adjustment-input-wrapper'
                  >
                    <div className='adjustment-text-reset-wrapper'>
                      <span className={'adjustment-text'}>
                        {title}
                      </span>
                      {state !== '0' &&
                        <button 
                          onClick={resetValue}
                          className='adjustment-reset-button'
                        >
                          Reset
                        </button>                      
                      }
                    </div>
                    <div
                      className='adjustment-input-value-wrapper'>
                      {title === 'vignette'
                        ? <input 
                            className='adjustment-input' 
                            max='100' 
                            min='0' 
                            type='range'
                            style={{
                              backgroundImage: `linear-gradient(
                                to right, 
                                rgb(38, 38, 38) 0%, 
                                rgb(38, 38, 38) ${state}%, 
                                rgb(219, 219, 219) ${state}%, 
                                rgb(219, 219, 219) 100%)`
                            }}
                            value={state}
                            onChange={valueHandler}
                          />
                        : <input 
                            className='adjustment-input' 
                            max='100' 
                            min='-100' 
                            type='range'
                            style={{
                              backgroundImage: `linear-gradient(
                                to right, 
                                rgb(219, 219, 219) 0%, 
                                rgb(219, 219, 219) ${
                                  state < 0 
                                    ? 50 + (state / 2) 
                                    : 50
                                }%, 
                                rgb(38, 38, 38) ${
                                  state < 0 
                                    ? 50 + (state / 2) 
                                    : 50
                                }%, 
                                rgb(38, 38, 38) ${
                                  state > 0 
                                    ? 50 + (state / 2) 
                                    : 50
                                }%, 
                                rgb(219, 219, 219) ${
                                  state > 0 
                                    ? 50 + (state / 2) 
                                    : 50
                                }%, 
                                rgb(219, 219, 219) 100%)`,
                            }}
                            value={state}
                            onChange={valueHandler}
                          />
                      }
                      <span className={state === '0' ? ['adjustment-input-value', 'zero'].join(' ') : 'adjustment-input-value'}>
                        {state}
                      </span>                      
                    </div>
                  </div>
                )
              })}
            </div>          
          }
        </div>
        {currentFilterPage === 'filters' && selectedFilter !== 'normal' &&
          <div className='filter-fade-input-wrapper'>
            <div className='filter-fade-input-value-wrapper'>
              <input 
                className='filter-fade-input' 
                max='100' 
                min='0' 
                type="range"
                value={filterFadeValue}
                onChange={filterFadeHandler}
                style={{
                  backgroundImage: `linear-gradient(
                    to right, 
                    rgb(38, 38, 38) 0%, 
                    rgb(38, 38, 38) ${filterFadeValue}%, 
                    rgb(219, 219, 219) ${filterFadeValue}%, 
                    rgb(219, 219, 219) 100%)`
                }}
              />
              <span className='filter-fade-input-value'>
                {filterFadeValue}
              </span>
            </div>
          </div>        
        }
      </div>
    </div>
  )
}

export default UploadModalFilters;