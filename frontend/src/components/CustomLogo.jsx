import React from 'react';

const CustomLogo = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Diamante exterior con puntas */}
      <path
        d="M50 10 L75 25 L90 50 L75 75 L50 90 L25 75 L10 50 L25 25 Z"
        fill="currentColor"
        stroke="none"
      />
      
      {/* Círculo interior grande */}
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="white"
        stroke="none"
      />
      
      {/* Círculo central pequeño */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill="currentColor"
        stroke="none"
      />
      
      {/* Elemento superior pequeño */}
      <ellipse
        cx="50"
        cy="35"
        rx="3"
        ry="6"
        fill="currentColor"
      />
    </svg>
  );
};

export default CustomLogo;