import React from 'react';
import SuperiorExplorePage from '../components/SuperiorExplorePage';
import { Toaster } from '../components/ui/toaster';
import { TikTokProvider } from '../contexts/TikTokContext';

// Demo page sin autenticación para mostrar la nueva UI
const ExploreDemo = () => {
  return (
    <TikTokProvider>
      <div className="App">
        <SuperiorExplorePage />
        <Toaster />
      </div>
    </TikTokProvider>
  );
};

export default ExploreDemo;