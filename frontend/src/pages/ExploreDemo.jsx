import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SuperiorExplorePage from '../components/SuperiorExplorePage';
import { Toaster } from '../components/ui/toaster';
import { TikTokProvider } from '../contexts/TikTokContext';

// Demo page sin autenticación para mostrar la nueva UI
const ExploreDemo = () => {
  return (
    <BrowserRouter>
      <TikTokProvider>
        <div className="App">
          <SuperiorExplorePage />
          <Toaster />
        </div>
      </TikTokProvider>
    </BrowserRouter>
  );
};

export default ExploreDemo;