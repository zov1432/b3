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

// Revolutionary header with morphing effects
const RevolutionaryHeader = ({ viewMode, setViewMode }) => {
  const [currentMode, setCurrentMode] = useState(0);
  const modes = ['VOTA', 'TOK', 'BATTLE', 'LIVE'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMode(prev => (prev + 1) % modes.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="text-center py-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Main title */}
      <motion.h1 
        className="text-6xl md:text-8xl font-black mb-4 relative z-10"
        style={{
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffecd2)',
          backgroundSize: '400% 400%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={modes[currentMode]}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            {modes[currentMode]}
          </motion.span>
        </AnimatePresence>
        {" TOK"}
      </motion.h1>

      {/* Subtitle with revolution effect */}
      <motion.p 
        className="text-xl md:text-2xl text-white/90 mb-8 font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        🔥 Revolución en Votaciones Multimedia 🔥
      </motion.p>

      {/* Stats */}
      <motion.div 
        className="flex justify-center items-center gap-8 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        {[
          { icon: Users, label: 'Usuarios Activos', value: '2.8M', color: 'text-blue-400' },
          { icon: Trophy, label: 'Batallas Diarias', value: '50K', color: 'text-yellow-400' },
          { icon: TrendingUp, label: 'Tendencias', value: '∞', color: 'text-green-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.2 }}
          >
            <div className="flex items-center justify-center mb-2">
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div className={cn("text-2xl font-black", stat.color)}>{stat.value}</div>
            <div className="text-white/70 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* View mode selector with advanced effects */}
      <motion.div 
        className="flex justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        {[
          { mode: 'battle', label: 'Modo Batalla', icon: Target, color: 'from-red-500 to-pink-600' },
          { mode: 'feed', label: 'Feed TikTok', icon: Play, color: 'from-blue-500 to-purple-600' },
          { mode: 'trending', label: 'Tendencias', icon: TrendingUp, color: 'from-green-500 to-teal-600' },
          { mode: 'live', label: 'Live Arena', icon: Flame, color: 'from-orange-500 to-red-600' }
        ].map((option) => (
          <motion.button
            key={option.mode}
            className={cn(
              "relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all overflow-hidden",
              viewMode === option.mode 
                ? `bg-gradient-to-r ${option.color} text-white shadow-xl scale-110` 
                : "bg-black/40 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:scale-105"
            )}
            onClick={() => setViewMode(option.mode)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow effect for active mode */}
            {viewMode === option.mode && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-30 blur-xl`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            
            <option.icon className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{option.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

// Estadísticas en tiempo real
const LiveStats = () => {
  const [stats, setStats] = useState({
    activeUsers: 2847392,
    totalVotes: 89472038,
    liveBattles: 247,
    trendsCreated: 1248
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 100),
        totalVotes: prev.totalVotes + Math.floor(Math.random() * 1000),
        liveBattles: prev.liveBattles + Math.floor(Math.random() * 5) - 2,
        trendsCreated: prev.trendsCreated + Math.floor(Math.random() * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {[
        { 
          label: 'Usuarios Activos', 
          value: stats.activeUsers.toLocaleString(), 
          icon: Users, 
          color: 'from-blue-500 to-cyan-500',
          gradient: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20'
        },
        { 
          label: 'Votos Totales', 
          value: stats.totalVotes.toLocaleString(), 
          icon: Trophy, 
          color: 'from-yellow-500 to-orange-500',
          gradient: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20'
        },
        { 
          label: 'Batallas Live', 
          value: stats.liveBattles, 
          icon: Flame, 
          color: 'from-red-500 to-pink-500',
          gradient: 'bg-gradient-to-r from-red-500/20 to-pink-500/20'
        },
        { 
          label: 'Tendencias', 
          value: stats.trendsCreated, 
          icon: TrendingUp, 
          color: 'from-green-500 to-emerald-500',
          gradient: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20'
        }
      ].map((stat, index) => (
        <motion.div
          key={stat.label}
          className={cn(
            "relative p-6 rounded-2xl border border-white/10 backdrop-blur-xl",
            stat.gradient
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={cn("p-2 rounded-xl bg-gradient-to-r", stat.color)}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            
            <motion.div
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          </div>
          
          <motion.div
            className={cn("text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r", stat.color)}
            key={stat.value} // Re-render when value changes
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {stat.value}
          </motion.div>
          <div className="text-white/70 text-sm font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Componente principal
const VotingRevolutionPage = () => {
  const [polls, setPolls] = useState(mockPolls);
  const [viewMode, setViewMode] = useState('battle');
  const [selectedPoll, setSelectedPoll] = useState(null);
  
  const { isTikTokMode } = useTikTok();
  const { userProfile, trackAction } = useAddiction();
  const containerRef = useRef(null);
  
  // Scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  // Handlers para acciones
  const handleVote = async (pollId, optionId) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId && !poll.userVote) {
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
    
    await trackAction('vote');
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
    
    await trackAction('like');
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
    
    await trackAction('share');
  };
  
  const handleComment = async (pollId) => {
    console.log('Opening comments for poll:', pollId);
    await trackAction('create');
  };
  
  const handleCreatePoll = async (pollData) => {
    console.log('Creating new poll:', pollData);
    await trackAction('create');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 relative overflow-hidden">
      {/* Background effects */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ y: backgroundY, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black/80 to-blue-900/50" />
        
        {/* Animated particles */}
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </motion.div>

      {/* Main content */}
      <div ref={containerRef} className="relative z-10 min-h-screen pb-24">
        {/* Revolutionary Header */}
        <RevolutionaryHeader viewMode={viewMode} setViewMode={setViewMode} />
        
        {/* Live Stats */}
        <div className="px-6 mb-12">
          <LiveStats />
        </div>

        {/* Content based on view mode */}
        <div className="px-6">
          <AnimatePresence mode="wait">
            {viewMode === 'battle' && (
              <motion.div
                key="battle"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {polls.slice(0, 6).map((poll, index) => (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MediaBattleCard
                      poll={poll}
                      onVote={handleVote}
                      onLike={handleLike}
                      onShare={handleShare}
                      onComment={handleComment}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {viewMode === 'feed' && (
              <motion.div
                key="feed"
                className="max-w-md mx-auto space-y-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
              >
                {polls.slice(0, 3).map((poll, index) => (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <MediaBattleCard
                      poll={poll}
                      onVote={handleVote}
                      onLike={handleLike}
                      onShare={handleShare}
                      onComment={handleComment}
                      isFullScreen={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {(viewMode === 'trending' || viewMode === 'live') && (
              <motion.div
                key={viewMode}
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
              >
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  {viewMode === 'trending' ? (
                    <TrendingUp className="w-20 h-20 text-green-400" />
                  ) : (
                    <Flame className="w-20 h-20 text-red-400" />
                  )}
                </motion.div>
                
                <h2 className="text-4xl font-black text-white mb-4">
                  {viewMode === 'trending' ? 'Tendencias Explosivas' : 'Arena Live'}
                </h2>
                <p className="text-white/70 text-xl">
                  {viewMode === 'trending' ? '🚀 Próximamente disponible' : '⚡ Batallas épicas en tiempo real'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Neural Navigation */}
        <NeuralNavigation onCreatePoll={handleCreatePoll} />
      </div>
    </div>
  );
};

export default VotingRevolutionPage;