import React from 'react';

const CustomLogo = ({ size = 24, className = "" }) => {
  return (
    <img
      src="https://customer-assets.emergentagent.com/job_red-circle-edit/artifacts/7zf3s08s_Screenshot_2025-08-09-01-39-33-64_99c04817c0de5652397fc8b56c3b3817.jpg"
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