import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BottomNavigation from './components/BottomNavigation';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import { Toaster } from './components/ui/toaster';
import { createPoll } from './services/mockData';
import { useToast } from './hooks/use-toast';
import { TikTokProvider, useTikTok } from './contexts/TikTokContext';

function AppContent() {
  const { toast } = useToast();
  const { isTikTokMode } = useTikTok();

  const handleCreatePoll = (pollData) => {
    const newPoll = createPoll(pollData);
    // En la implementación real, esto haría una llamada a la API
    console.log('Nueva votación creada:', newPoll);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Redirect root to feed */}
          <Route path="/" element={<Navigate to="/feed" replace />} />
          
          {/* Main pages */}
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Catch all - redirect to feed */}
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>

        {/* Bottom Navigation - Hidden in TikTok mode */}
        {!isTikTokMode && (
          <BottomNavigation onCreatePoll={handleCreatePoll} />
        )}

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />

        {/* Toast notifications */}
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <TikTokProvider>
      <AppContent />
    </TikTokProvider>
  );
}

export default App;