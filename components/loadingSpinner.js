import React from 'react'
import PropTypes from 'prop-types';

const LoadingSpinner = ({speed}) => {
  return (
    <svg viewBox="0 0 64 64">
        <g>
          <defs>
            <linearGradient id="sGD" gradientUnits="userSpaceOnUse" x1="55" y1="46" x2="2" y2="46">
              <stop offset="0.1"></stop>
              <stop offset="1"></stop>
            </linearGradient>
          </defs>
          <g strokeWidth="4" strokeLinecap="round" fill="none" transform="rotate(82.912 32 32)">
          <path stroke="url(#sGD)" d="M4,32 c0,15,12,28,28,28c8,0,16-4,21-9"></path>
          <path d="M60,32 C60,16,47.464,4,32,4S4,16,4,32"></path>
          <animateTransform values="0,32,32;360,32,32" attributeName="transform" type="rotate" repeatCount="indefinite" dur={speed}></animateTransform>
          </g>
        </g>
      </svg>
  )
};

LoadingSpinner.propTypes = {
  speed: PropTypes.string
};

export default LoadingSpinner;
