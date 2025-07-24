import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';
import { useTikTok } from '../contexts/TikTokContext';
import { useAddiction } from '../contexts/AddictionContext';
import { 
  Flame, Trophy, Target, Zap, Users, TrendingUp, 
  Play, Grid3X3, BarChart3, Camera, Video, 
  Crown, Star, Award, Sparkles
} from 'lucide-react';

// Import components
import MediaBattleCard from './MediaBattleCard';
import NeuralNavigation from './NeuralNavigation';
import { mockPolls } from '../services/mockData';

// Revolutionary header with animated stats
const VotingStatsHeader = ({ totalPolls, totalVotes, activeUsers }) => {
  const [counters, setCounters] = useState({
    polls: 0,
    votes: 0,
    users: 0
  });
  
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    
    const pollsStep = totalPolls / steps;
    const votesStep = totalVotes / steps;
    const usersStep = activeUsers / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      
      setCounters({
        polls: Math.min(Math.floor(pollsStep * currentStep), totalPolls),
        votes: Math.min(Math.floor(votesStep * currentStep), totalVotes),
        users: Math.min(Math.floor(usersStep * currentStep), activeUsers)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [totalPolls, totalVotes, activeUsers]);
  
  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-6">
          <motion.h1 
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            style={{
              backgroundSize: '300% 300%'
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            VOTA TOK
          </motion.h1>
          <motion.p 
            className="text-xl text-white/90 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            La revolución de las votaciones multimedia
          </motion.p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6">
          <motion.div
            className="text-center p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {counters.polls.toLocaleString()}
            </div>
            <div className="text-white/80 text-sm font-semibold">
              Batallas Activas
            </div>
          </motion.div>
          
          <motion.div
            className="text-center p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Target className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {counters.votes.toLocaleString()}
            </div>
            <div className="text-white/80 text-sm font-semibold">
              Votos Totales
            </div>
          </motion.div>
          
          <motion.div
            className="text-center p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {counters.users.toLocaleString()}
            </div>
            <div className="text-white/80 text-sm font-semibold">
              Usuarios Activos
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced view mode selector
const ViewModeSelector = ({ currentMode, onModeChange, className = "" }) => {
  const modes = [
    { id: 'feed', label: 'Feed', icon: Grid3X3, description: 'Vista clásica' },
    { id: 'battle', label: 'Batalla', icon: Target, description: 'Modo épico' },
    { id: 'trending', label: 'Trending', icon: TrendingUp, description: 'Lo más viral' },
    { id: 'live', label: 'En Vivo', icon: Zap, description: 'Tiempo real' }
  ];
  
  return (
    <div className={cn("flex items-center gap-2 p-2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20", className)}>
      {modes.map((mode) => (
        <motion.button
          key={mode.id}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all",
            currentMode === mode.id
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
              : "text-white/80 hover:text-white hover:bg-white/10"
          )}
          onClick={() => onModeChange(mode.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <mode.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{mode.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

// Trending hashtags and categories
const TrendingSection = ({ className = "" }) => {
  const trendingTopics = [
    { tag: '#OutfitBattle', votes: '2.3M', growth: '+12%', color: 'from-pink-500 to-red-500' },
    { tag: '#FoodFight', votes: '1.8M', growth: '+8%', color: 'from-orange-500 to-yellow-500' },
    { tag: '#DanceOff', votes: '3.1M', growth: '+15%', color: 'from-purple-500 to-blue-500' },
    { tag: '#TechReview', votes: '901K', growth: '+5%', color: 'from-green-500 to-teal-500' }
  ];
  
  return (
    <div className={cn("mb-8", className)}>
      <motion.h2 
        className="text-2xl font-bold text-white mb-4 flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Flame className="w-6 h-6 text-orange-500" />
        Tendencias Explosivas
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trendingTopics.map((topic, index) => (
          <motion.div
            key={topic.tag}
            className={cn(
              "p-4 rounded-2xl bg-gradient-to-br border border-white/20 cursor-pointer group",
              topic.color
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-white">
              <div className="font-bold text-lg mb-1">{topic.tag}</div>
              <div className="text-white/90 text-sm mb-2">{topic.votes} votos</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>{topic.growth}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Main Revolutionary Page Component
const VotingRevolutionPage = () => {
  const [polls, setPolls] = useState(mockPolls);
  const [viewMode, setViewMode] = useState('feed');
  const [isLoading, setIsLoading] = useState(false);
  
  const { isTikTokMode } = useTikTok();
  const { userProfile, triggerAction } = useAddiction();
  const containerRef = useRef(null);
  
  // Scroll animations
  const { scrollY } = useScroll({ container: containerRef });
  const headerY = useTransform(scrollY, [0, 300], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  
  // Stats calculation
  const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);
  const activeUsers = 157843; // Mock data
  
  // Enhanced interaction handlers
  const handleVote = async (pollId, optionId) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          userVote: optionId,
          options: poll.options.map(opt => ({
            ...opt,
            votes: opt.id === optionId ? opt.votes + 1 : opt.votes
          })),
          totalVotes: poll.totalVotes + 1
        };
      }
      return poll;
    }));
    
    await triggerAction('vote');
  };
  
  const handleLike = async (pollId) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          userLiked: !poll.userLiked,
          likes: poll.userLiked ? poll.likes - 1 : poll.likes + 1
        };
      }
      return poll;
    }));
    
    await triggerAction('like');
  };
  
  const handleShare = async (pollId) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          shares: poll.shares + 1
        };
      }
      return poll;
    }));
    
    await triggerAction('share');
  };
  
  const handleComment = async (pollId) => {
    console.log('Opening comments for poll:', pollId);
    await triggerAction('create');
  };
  
  const handleCreatePoll = async (pollData) => {
    console.log('Creating new poll:', pollData);
    await triggerAction('create');
  };
  
  if (isTikTokMode) {
    return null; // TikTok mode is handled elsewhere
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
        {/* Floating geometric shapes */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 20 + 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div 
        ref={containerRef}
        className="relative z-10 min-h-screen overflow-y-auto pb-24"
      >
        {/* Animated Header */}
        <motion.div
          className="sticky top-0 z-20 p-6"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <VotingStatsHeader 
            totalPolls={polls.length}
            totalVotes={totalVotes}
            activeUsers={activeUsers}
          />
          
          {/* View Mode Selector */}
          <div className="flex justify-center mb-6">
            <ViewModeSelector 
              currentMode={viewMode}
              onModeChange={setViewMode}
            />
          </div>
          
          {/* Trending Section */}
          <TrendingSection />
        </motion.div>
        
        {/* Content Area */}
        <div className="px-6">
          <AnimatePresence mode="wait">
            {viewMode === 'feed' && (
              <motion.div
                key="feed"
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {polls.map((poll, index) => (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MediaBattleCard
                      poll={poll}
                      onVote={handleVote}
                      onLike={handleLike}
                      onShare={handleShare}
                      onComment={handleComment}
                      viewMode="battle" // Always use battle mode for revolutionary experience
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {viewMode === 'battle' && (
              <motion.div
                key="battle"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                {polls.map((poll, index) => (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, rotateY: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <MediaBattleCard
                      poll={poll}
                      onVote={handleVote}
                      onLike={handleLike}
                      onShare={handleShare}
                      onComment={handleComment}
                      viewMode="battle"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {(viewMode === 'trending' || viewMode === 'live') && (
              <motion.div
                key={viewMode}
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {viewMode === 'trending' ? '¡Próximamente Trending!' : '¡Modo En Vivo Próximamente!'}
                </h2>
                <p className="text-white/80 text-lg">
                  Estamos preparando algo épico para esta sección
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Neural Navigation */}
      <NeuralNavigation onCreatePoll={handleCreatePoll} />
    </div>
  );
};

export default VotingRevolutionPage;