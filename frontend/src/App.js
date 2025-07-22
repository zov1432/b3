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

// Import Addiction System
import { AddictionProvider, useAddiction } from './contexts/AddictionContext';
import { 
  RewardPopup, 
  LevelUpAnimation, 
  AchievementToast, 
  ProgressBar,
  FOMOAlert,
  JackpotExplosion 
} from './components/AddictionUI';

function AppContent() {
  const { toast } = useToast();
  const { isTikTokMode } = useTikTok();
  const {
    showRewardPopup,
    rewardData,
    showLevelUp,
    level,
    showAchievement,
    achievementData,
    showJackpot,
    jackpotData,
    fomoContent,
    setShowRewardPopup,
    setShowLevelUp,
    setShowAchievement,
    setShowJackpot,
    userProfile,
    xp,
    streak,
    getXpToNextLevel,
    getXpProgress
  } = useAddiction();

  const handleCreatePoll = async (pollData) => {
    const newPoll = createPoll(pollData);
    console.log('Nueva votación creada:', newPoll);
    
    toast({
      title: "¡Votación creada!",
      description: "Tu votación ha sido publicada exitosamente",
    });
  };

  const handleFOMOAction = (fomoItem) => {
    // Navigate to the FOMO content
    window.location.href = `/poll/${fomoItem.poll_id}`;
  };

  return (
    <div className="App relative">
      <BrowserRouter>
        {/* Progress Bar - Always visible except in TikTok mode */}
        {!isTikTokMode && userProfile && (
          <div className="fixed top-4 left-4 right-4 z-[9990] pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
              <ProgressBar
                level={level}
                xp={xp}
                xpToNext={getXpToNextLevel()}
                progress={getXpProgress()}
                streak={streak}
                className="backdrop-blur-md"
              />
            </div>
          </div>
        )}

        {/* FOMO Alert - Show when not in TikTok mode */}
        {!isTikTokMode && fomoContent && fomoContent.length > 0 && (
          <FOMOAlert
            fomoContent={fomoContent}
            onTakeAction={handleFOMOAction}
            onClose={() => {
              // Hide FOMO for this session
              sessionStorage.setItem('fomoHidden', 'true');
            }}
          />
        )}

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

        {/* Toast notifications */}
        <Toaster />

        {/* === ADDICTION UI COMPONENTS === */}
        
        {/* Reward Popup */}
        <RewardPopup
          show={showRewardPopup}
          reward={rewardData}
          onClose={() => setShowRewardPopup(false)}
        />

        {/* Level Up Animation */}
        <LevelUpAnimation
          show={showLevelUp}
          level={level}
          onClose={() => setShowLevelUp(false)}
        />

        {/* Achievement Toast */}
        <AchievementToast
          show={showAchievement}
          achievement={achievementData}
          onClose={() => setShowAchievement(false)}
        />

        {/* Jackpot Explosion */}
        <JackpotExplosion
          show={showJackpot}
          jackpotData={jackpotData}
          onClose={() => setShowJackpot(false)}
        />
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <AddictionProvider>
      <TikTokProvider>
        <AppContent />
      </TikTokProvider>
    </AddictionProvider>
  );
}

export default App;