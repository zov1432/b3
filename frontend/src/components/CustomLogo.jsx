import React from 'react';

const CustomLogo = ({ size = 24, className = "" }) => {
  return (
    <img
      src="https://customer-assets.emergentagent.com/job_red-circle-edit/artifacts/7rnoyyyr_file_00000000f1a8620ab186d3fbdb296465.png"
      alt="Custom Logo"
      width={size}
      height={size}
      className={`${className} object-contain rounded`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        objectFit: 'contain'
      }}
    />
  );
};

export default CustomLogo;