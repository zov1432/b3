import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import BottomNavigation from './components/BottomNavigation';
import NeuralNavigation from './components/NeuralNavigation';
import RightSideNavigation from './components/RightSideNavigation';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ExploreDemo from './pages/ExploreDemo';
import LiveBattleDemoPage from './pages/LiveBattleDemoPage';
import FeedDemoPage from './pages/FeedDemoPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import AuthPage from './pages/AuthPage';
import TestFOMO from './TestFOMO';
import { Toaster } from './components/ui/toaster';
import { createPoll } from './services/mockData';
import { useToast } from './hooks/use-toast';
import { TikTokProvider, useTikTok } from './contexts/TikTokContext';

// Import Authentication and Addiction
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AddictionProvider } from './contexts/AddictionContext';

function AppContent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isTikTokMode } = useTikTok();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const handleCreatePoll = async (pollData) => {
    const newPoll = createPoll(pollData);
    console.log('Nueva votación creada:', newPoll);
    
    toast({
      title: "¡Votación creada!",
      description: "Tu votación ha sido publicada exitosamente",
    });
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="App relative">
        <Routes>
          {/* Redirect root to feed */}
          <Route path="/" element={<Navigate to="/feed" replace />} />
          
          {/* Main pages */}
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile/:userId?" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Demo & Test Pages - Remove in production */}
          <Route path="/explore-demo" element={<ExploreDemo />} />
          <Route path="/battle-demo" element={<LiveBattleDemoPage />} />
          <Route path="/feed-demo" element={<FeedDemoPage />} />
          <Route path="/test-fomo" element={<TestFOMO />} />
        </Routes>

        {/* Bottom Navigation - Hide in TikTok mode */}
        {!isTikTokMode && isAuthenticated && <BottomNavigation />}
        
        {/* Right Side Navigation - Show when authenticated */}
        {isAuthenticated && <RightSideNavigation onCreatePoll={handleCreatePoll} />}

        <Toaster />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TikTokProvider>
          <AppContent />
        </TikTokProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;