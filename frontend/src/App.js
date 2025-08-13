import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import BottomNavigation from './components/BottomNavigation';
import NeuralNavigation from './components/NeuralNavigation';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ExploreDemo from './pages/ExploreDemo';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import AuthPage from './pages/AuthPage';
import TestFOMO from './TestFOMO';
import { Toaster } from './components/ui/toaster';
import { createPoll } from './services/mockData';
import { useToast } from './hooks/use-toast';
import { TikTokProvider, useTikTok } from './contexts/TikTokContext';

// Import Authentication
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Addiction System
import { AddictionProvider, useAddiction } from './contexts/AddictionContext';
import { 
  RewardPopup, 
  LevelUpAnimation, 
  AchievementToast, 
  FOMOAlert,
  JackpotExplosion 
} from './components/AddictionUI';

function AppContent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isTikTokMode } = useTikTok();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [fomoHidden, setFomoHidden] = useState(
    sessionStorage.getItem('fomoHidden') === 'true'
  );
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
    // Show participation success message
    toast({
      title: "¡Participación exitosa!",
      description: `Te has unido a "${fomoItem.title}" exitosamente`,
    });
    
    // Hide FOMO after participation
    setFomoHidden(true);
    sessionStorage.setItem('fomoHidden', 'true');
    
    // Navigate to explore page to see more content
    navigate('/explore');
  };

  const handleFOMOClose = () => {
    setFomoHidden(true);
    sessionStorage.setItem('fomoHidden', 'true');
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
        {/* FOMO Alert - Show when not in TikTok mode and not hidden */}
        {!isTikTokMode && !fomoHidden && (
          <FOMOAlert
            fomoContent={fomoContent && fomoContent.length > 0 ? fomoContent : [
              {
                id: "test-fomo",
                title: "¿Quién ganó el mejor outfit de la semana?",
                urgency_level: 4,
                expires_at: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
                current_participants: 472,
                max_participants: 1363,
                is_trending: true,
                poll_id: "test-poll"
              }
            ]}
            onTakeAction={handleFOMOAction}
            onClose={handleFOMOClose}
          />
        )}

        <Routes>
          {/* Redirect root to feed */}
          <Route path="/" element={<Navigate to="/feed" replace />} />
          
          {/* Main pages */}
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          
          {/* Catch all - redirect to feed */}
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>

        {/* Revolutionary Neural Navigation - Only show when not in TikTok mode */}
        {!isTikTokMode && (
          <NeuralNavigation onCreatePoll={handleCreatePoll} />
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
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Demo route - no auth required */}
        <Route path="/demo" element={<ExploreDemo />} />
        
        {/* Test page accessible without auth */}
        <Route path="/test-fomo" element={<TestFOMO />} />
        
        {/* Main app with providers */}
        <Route path="/*" element={
          <AuthProvider>
            <AddictionProvider>
              <TikTokProvider>
                <AppContent />
              </TikTokProvider>
            </AddictionProvider>
          </AuthProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;