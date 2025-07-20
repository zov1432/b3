import React, { createContext, useContext, useState } from 'react';

const TikTokContext = createContext();

export const useTikTok = () => {
  const context = useContext(TikTokContext);
  if (!context) {
    throw new Error('useTikTok must be used within a TikTokProvider');
  }
  return context;
};

export const TikTokProvider = ({ children }) => {
  const [isTikTokMode, setIsTikTokMode] = useState(false);

  const enterTikTokMode = () => {
    setIsTikTokMode(true);
    // Prevent body scroll when in TikTok mode
    document.body.style.overflow = 'hidden';
  };

  const exitTikTokMode = () => {
    setIsTikTokMode(false);
    // Restore body scroll
    document.body.style.overflow = 'auto';
  };

  const toggleTikTokMode = () => {
    if (isTikTokMode) {
      exitTikTokMode();
    } else {
      enterTikTokMode();
    }
  };

  return (
    <TikTokContext.Provider 
      value={{
        isTikTokMode,
        enterTikTokMode,
        exitTikTokMode,
        toggleTikTokMode
      }}
    >
      {children}
    </TikTokContext.Provider>
  );
};

export default TikTokContext;