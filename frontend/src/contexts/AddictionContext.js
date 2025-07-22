import React, { createContext, useContext, useState, useEffect } from 'react';
import { addictionAPI, behaviorTracker } from '../services/addictionApi';

const AddictionContext = createContext();

export const useAddiction = () => {
  const context = useContext(AddictionContext);
  if (!context) {
    throw new Error('useAddiction must be used within an AddictionProvider');
  }
  return context;
};

export const AddictionProvider = ({ children }) => {
  // User Profile State
  const [userProfile, setUserProfile] = useState(null);
  const [userAchievements, setUserAchievements] = useState([]);
  const [userStreaks, setUserStreaks] = useState([]);
  
  // Addiction Metrics
  const [addictionScore, setAddictionScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // FOMO & Social
  const [fomoContent, setFomoContent] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [socialProofData, setSocialProofData] = useState({});
  
  // UI States
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [rewardData, setRewardData] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementData, setAchievementData] = useState(null);
  
  // Dopamine Effects
  const [dopamineHits, setDopamineHits] = useState(0);
  const [showJackpot, setShowJackpot] = useState(false);
  const [jackpotData, setJackpotData] = useState(null);

  // Initialize user
  useEffect(() => {
    initializeUser();
    loadFOMOContent();
    loadLeaderboard();
    
    // Load user data every 60 seconds
    const dataInterval = setInterval(() => {
      if (userProfile) {
        refreshUserData();
      }
    }, 60000);

    return () => clearInterval(dataInterval);
  }, []);

  const initializeUser = async () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      // Generate anonymous user
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', userId);
      
      try {
        const profile = await addictionAPI.createUserProfile(userId);
        setUserProfile(profile);
        setLevel(profile.level);
        setXp(profile.xp);
        setStreak(profile.current_streak);
      } catch (error) {
        console.error('Failed to create user profile:', error);
      }
    } else {
      try {
        const profile = await addictionAPI.getUserProfile(userId);
        setUserProfile(profile);
        setLevel(profile.level);
        setXp(profile.xp);
        setStreak(profile.current_streak);
        
        if (profile.addiction_metrics) {
          setAddictionScore(profile.addiction_metrics.addiction_score);
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    }
    
    // Load achievements and streaks
    loadUserAchievements();
    loadUserStreaks();
  };

  const refreshUserData = async () => {
    if (!userProfile) return;
    
    try {
      const profile = await addictionAPI.getUserProfile(userProfile.id);
      setUserProfile(profile);
      setLevel(profile.level);
      setXp(profile.xp);
      setStreak(profile.current_streak);
      
      if (profile.addiction_metrics) {
        setAddictionScore(profile.addiction_metrics.addiction_score);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const loadUserAchievements = async () => {
    if (!userProfile) return;
    
    try {
      const achievements = await addictionAPI.getUserAchievements(userProfile.id);
      setUserAchievements(achievements);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const loadUserStreaks = async () => {
    if (!userProfile) return;
    
    try {
      const streaks = await addictionAPI.getUserStreaks(userProfile.id);
      setUserStreaks(streaks);
    } catch (error) {
      console.error('Failed to load streaks:', error);
    }
  };

  const loadFOMOContent = async () => {
    try {
      const content = await addictionAPI.getFOMOContent();
      setFomoContent(content);
    } catch (error) {
      console.error('Failed to load FOMO content:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const board = await addictionAPI.getLeaderboard();
      setLeaderboard(board);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const getSocialProof = async (pollId) => {
    try {
      const proof = await addictionAPI.getSocialProof(pollId);
      setSocialProofData(prev => ({
        ...prev,
        [pollId]: proof
      }));
      return proof;
    } catch (error) {
      console.error('Failed to get social proof:', error);
      return null;
    }
  };

  // Action tracking with dopamine hits
  const trackAction = async (actionType, context = {}) => {
    if (!userProfile) return;

    try {
      // Track with behavior tracker
      switch (actionType) {
        case 'vote':
          behaviorTracker.trackVote();
          break;
        case 'create':
          behaviorTracker.trackPollCreation();
          break;
        case 'like':
          behaviorTracker.trackLike();
          break;
        case 'share':
          behaviorTracker.trackShare();
          break;
        case 'view':
          behaviorTracker.trackPollView();
          break;
      }

      // Track action and get rewards
      const result = await addictionAPI.trackUserAction(userProfile.id, actionType, context);
      
      if (result.success) {
        // Update user profile
        setUserProfile(result.profile);
        setLevel(result.profile.level);
        setXp(result.profile.xp);
        setStreak(result.profile.current_streak);
        
        // Show reward popup
        if (result.reward) {
          setRewardData(result.reward);
          setShowRewardPopup(true);
          
          // Auto hide after 3 seconds
          setTimeout(() => setShowRewardPopup(false), 3000);
        }
        
        // Show level up
        if (result.level_up) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 4000);
        }
        
        // Show achievements
        if (result.achievements_unlocked && result.achievements_unlocked.length > 0) {
          setAchievementData(result.achievements_unlocked[0]); // Show first achievement
          setShowAchievement(true);
          setTimeout(() => setShowAchievement(false), 5000);
          
          // Reload achievements
          loadUserAchievements();
        }
        
        // Track dopamine hits
        if (result.dopamine_triggers > 0) {
          setDopamineHits(prev => prev + result.dopamine_triggers);
        }
        
        // Rare jackpot chance (0.1%)
        if (Math.random() < 0.001) {
          triggerJackpot();
        }
      }
      
      return result;
    } catch (error) {
      console.error('Failed to track action:', error);
    }
  };

  const triggerJackpot = async () => {
    if (!userProfile) return;
    
    try {
      const jackpot = await addictionAPI.triggerJackpot(userProfile.id);
      setJackpotData(jackpot);
      setShowJackpot(true);
      
      // Refresh user data
      refreshUserData();
      
      setTimeout(() => setShowJackpot(false), 8000);
    } catch (error) {
      console.error('Failed to trigger jackpot:', error);
    }
  };

  // Progress calculations
  const getXpToNextLevel = () => {
    const nextLevelXp = (level ** 2) * 100 + level * 50;
    return Math.max(0, nextLevelXp - xp);
  };

  const getXpProgress = () => {
    const currentLevelXp = ((level - 1) ** 2) * 100 + (level - 1) * 50;
    const nextLevelXp = (level ** 2) * 100 + level * 50;
    const currentProgress = xp - currentLevelXp;
    const totalNeeded = nextLevelXp - currentLevelXp;
    return Math.max(0, Math.min(100, (currentProgress / totalNeeded) * 100));
  };

  const value = {
    // User Data
    userProfile,
    userAchievements,
    userStreaks,
    
    // Metrics
    addictionScore,
    level,
    xp,
    streak,
    dopamineHits,
    
    // Social & FOMO
    fomoContent,
    leaderboard,
    socialProofData,
    
    // UI States
    showRewardPopup,
    rewardData,
    showLevelUp,
    showAchievement,
    achievementData,
    showJackpot,
    jackpotData,
    
    // Actions
    trackAction,
    getSocialProof,
    refreshUserData,
    triggerJackpot,
    
    // Progress
    getXpToNextLevel,
    getXpProgress,
    
    // UI Controls
    setShowRewardPopup,
    setShowLevelUp,
    setShowAchievement,
    setShowJackpot
  };

  return (
    <AddictionContext.Provider value={value}>
      {children}
    </AddictionContext.Provider>
  );
};