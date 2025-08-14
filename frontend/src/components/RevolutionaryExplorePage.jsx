import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useTikTok } from '../contexts/TikTokContext';
import { useAddiction } from '../contexts/AddictionContext';

// Import our revolutionary components
import NeuralNavigation from '../components/NeuralNavigation';
import Immersive3DCard from '../components/Immersive3DCard';
import { AdvancedSwipeContainer, useHapticFeedback } from '../components/AdvancedGestures';
import { 
  MorphingContainer, 
  ParticleExplosion, 
  IntelligentMicroAnimation,
  ContextualColorMorph 
} from '../components/AdvancedVisualFeedback';

// Enhanced mock data with more sophisticated content
const generateRevolutionaryPollData = () => [
  {
    id: 'poll-1',
    title: '¿Cuál es tu estilo de vida ideal?',
    author: {
      name: 'María García',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b494?w=150',
      verified: true
    },
    timeAgo: '2 min',
    totalVotes: 15847,
    likes: 892,
    comments: 234,
    shares: 89,
    userVote: null,
    userLiked: false,
    userBookmarked: false,
    timeRemaining: '2 días restantes',
    options: [
      {
        id: 'opt-1',
        text: 'Aventurero nómada',
        emoji: '🏔️',
        votes: 6234,
        media: { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' }
      },
      {
        id: 'opt-2',
        text: 'Minimalista urbano',
        emoji: '🏙️',
        votes: 4892,
        media: { url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400' }
      },
      {
        id: 'opt-3',
        text: 'Vida en el campo',
        emoji: '🌾',
        votes: 3456,
        media: { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400' }
      },
      {
        id: 'opt-4',
        text: 'Lifestyle digital',
        emoji: '💻',
        votes: 1265,
        media: { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400' }
      }
    ]
  },
  {
    id: 'poll-2',
    title: '¿Qué superpoder elegirías?',
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      verified: true
    },
    timeAgo: '5 min',
    totalVotes: 23156,
    likes: 1247,
    comments: 567,
    shares: 234,
    userVote: null,
    userLiked: false,
    userBookmarked: true,
    timeRemaining: '5 horas restantes',
    options: [
      {
        id: 'opt-5',
        text: 'Volar',
        emoji: '🦅',
        votes: 8945,
        media: { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' }
      },
      {
        id: 'opt-6',
        text: 'Invisibilidad',
        emoji: '👻',
        votes: 7234,
        media: { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400' }
      },
      {
        id: 'opt-7',
        text: 'Teletransporte',
        emoji: '⚡',
        votes: 4567,
        media: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }
      },
      {
        id: 'opt-8',
        text: 'Leer mentes',
        emoji: '🧠',
        votes: 2410,
        media: { url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400' }
      }
    ]
  },
  {
    id: 'poll-3',
    title: '¿Cuál es tu mood de hoy?',
    author: {
      name: 'Sofia Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      verified: false
    },
    timeAgo: '12 min',
    totalVotes: 9847,
    likes: 456,
    comments: 123,
    shares: 67,
    userVote: null,
    userLiked: true,
    userBookmarked: false,
    timeRemaining: '1 día restante',
    options: [
      {
        id: 'opt-9',
        text: 'Energético',
        emoji: '⚡',
        votes: 3245,
        media: { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }
      },
      {
        id: 'opt-10',
        text: 'Relajado',
        emoji: '🧘',
        votes: 2876,
        media: { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=400' }
      },
      {
        id: 'opt-11',
        text: 'Creativo',
        emoji: '🎨',
        votes: 2134,
        media: { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400' }
      },
      {
        id: 'opt-12',
        text: 'Aventurero',
        emoji: '🏃',
        votes: 1592,
        media: { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400' }
      }
    ]
  }
];

// Revolutionary Main Page Component
const RevolutionaryExplorePage = () => {
  const [polls, setPolls] = useState(generateRevolutionaryPollData());
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'immersive'
  const [explosionActive, setExplosionActive] = useState(false);
  const [explosionPosition, setExplosionPosition] = useState({ x: 0, y: 0 });
  const [userEngagement, setUserEngagement] = useState('medium');
  
  const { isTikTokMode } = useTikTok();
  const { userProfile, trackAction } = useAddiction();
  const { triggerHaptic } = useHapticFeedback();
  const containerRef = useRef(null);
  
  // Dynamic engagement calculation
  useEffect(() => {
    const level = userProfile?.level || 1;
    const streak = userProfile?.streak || 0;
    const xp = userProfile?.xp || 0;
    
    if (level > 10 && streak > 15 && xp > 2000) {
      setUserEngagement('high');
    } else if (level > 5 && streak > 7 && xp > 1000) {
      setUserEngagement('medium');
    } else {
      setUserEngagement('low');
    }
  }, [userProfile]);
  
  // Revolutionary interaction handlers
  const handleVote = async (pollId, optionId, event) => {
    // Trigger particle explosion at click position
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setExplosionPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
      setExplosionActive(true);
      
      // Haptic feedback
      triggerHaptic('medium', event.currentTarget);
    }
    
    // Update poll data
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
    
    // Trigger addiction system
    await trackAction('vote');
    
    // Reset explosion after animation
    setTimeout(() => setExplosionActive(false), 2000);
  };
  
  const handleLike = async (pollId, event) => {
    if (event) {
      triggerHaptic('light', event.currentTarget);
    }
    
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
  
  const handleShare = async (pollId, event) => {
    if (event) {
      triggerHaptic('heavy', event.currentTarget);
    }
    
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
    await triggerAction('create'); // Create comment action
  };
  
  const handleBookmark = (pollId, event) => {
    if (event) {
      triggerHaptic('light', event.currentTarget);
    }
    
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          userBookmarked: !poll.userBookmarked
        };
      }
      return poll;
    }));
  };
  
  const handleCreatePoll = async (pollData) => {
    console.log('Creating new poll:', pollData);
    await triggerAction('create');
  };
  
  // Advanced gesture handlers
  const handleSwipe = (swipeType, data) => {
    console.log('Swipe detected:', swipeType, data);
    
    switch (swipeType) {
      case 'swipe-left':
        // Next page or filter
        break;
      case 'swipe-right':
        // Previous page or back
        break;
      case 'swipe-up':
        // Refresh or load more
        break;
      case 'swipe-down':
        // Menu or options
        break;
      case 'fast-swipe-up':
        // Quick scroll to top
        if (containerRef.current) {
          containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        break;
    }
  };
  
  if (isTikTokMode) {
    return null; // TikTok mode is handled elsewhere
  }
  
  return (
    <ContextualColorMorph 
      context="energy" 
      intensity={userEngagement}
      className="min-h-screen"
    >
      <div className="relative min-h-screen pb-20 overflow-hidden">
        {/* Revolutionary Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
        
        {/* Floating geometric shapes for depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
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
                duration: Math.random() * 10 + 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        {/* Header with dynamic morphing */}
        <motion.header 
          className="relative z-10 pt-16 pb-8 px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <MorphingContainer 
            morphType="organic" 
            trigger="hover"
            className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-6"
          >
            <div className="text-center">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-white mb-4"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                style={{
                  background: 'linear-gradient(45deg, #fff, #a855f7, #3b82f6, #fff)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Explora el Futuro
              </motion.h1>
              <motion.p 
                className="text-xl text-white/80 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Una experiencia más allá de TikTok e Instagram
              </motion.p>
              
              {/* View mode selector */}
              <div className="flex justify-center gap-4">
                {['grid', 'list', 'immersive'].map(mode => (
                  <IntelligentMicroAnimation
                    key={mode}
                    userEngagement={userEngagement}
                    contentType="general"
                  >
                    <motion.button
                      className={cn(
                        "px-6 py-3 rounded-full backdrop-blur-sm border border-white/20 text-white font-medium transition-all",
                        viewMode === mode 
                          ? "bg-white/20 shadow-lg" 
                          : "bg-white/10 hover:bg-white/15"
                      )}
                      onClick={() => setViewMode(mode)}
                      whileTap={{ scale: 0.95 }}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </motion.button>
                  </IntelligentMicroAnimation>
                ))}
              </div>
            </div>
          </MorphingContainer>
        </motion.header>
        
        {/* Revolutionary Content Area */}
        <AdvancedSwipeContainer
          onSwipe={handleSwipe}
          className="relative z-10 px-6"
        >
          <motion.main 
            ref={containerRef}
            className="max-w-6xl mx-auto"
            layout
          >
            <AnimatePresence mode="wait">
              {viewMode === 'grid' && (
                <motion.div
                  key="grid"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, staggerChildren: 0.1 }}
                >
                  {polls.map((poll, index) => (
                    <motion.div
                      key={poll.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <IntelligentMicroAnimation
                        userEngagement={userEngagement}
                        contentType="poll"
                      >
                        <MorphingContainer
                          morphType="blob"
                          trigger="hover"
                          className="h-fit"
                        >
                          <Immersive3DCard
                            poll={poll}
                            onVote={(pollId, optionId) => handleVote(pollId, optionId, event)}
                            onLike={(pollId) => handleLike(pollId, event)}
                            onShare={(pollId) => handleShare(pollId, event)}
                            onComment={handleComment}
                            onBookmark={(pollId) => handleBookmark(pollId, event)}
                            className="transform-gpu"
                          />
                        </MorphingContainer>
                      </IntelligentMicroAnimation>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              {viewMode === 'list' && (
                <motion.div
                  key="list"
                  className="space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  {polls.map((poll, index) => (
                    <motion.div
                      key={poll.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <IntelligentMicroAnimation
                        userEngagement={userEngagement}
                        contentType="poll"
                        className="w-full"
                      >
                        <Immersive3DCard
                          poll={poll}
                          onVote={(pollId, optionId) => handleVote(pollId, optionId, event)}
                          onLike={(pollId) => handleLike(pollId, event)}
                          onShare={(pollId) => handleShare(pollId, event)}
                          onComment={handleComment}
                          onBookmark={(pollId) => handleBookmark(pollId, event)}
                          className="max-w-2xl mx-auto"
                        />
                      </IntelligentMicroAnimation>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              {viewMode === 'immersive' && (
                <motion.div
                  key="immersive"
                  className="relative h-screen -mx-6 px-6"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <AnimatePresence mode="wait">
                      {polls.map((poll, index) => (
                        index === 0 && (
                          <motion.div
                            key={poll.id}
                            className="w-full max-w-lg"
                            initial={{ opacity: 0, rotateY: 90 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            exit={{ opacity: 0, rotateY: -90 }}
                            transition={{ duration: 0.8 }}
                          >
                            <Immersive3DCard
                              poll={poll}
                              onVote={(pollId, optionId) => handleVote(pollId, optionId, event)}
                              onLike={(pollId) => handleLike(pollId, event)}
                              onShare={(pollId) => handleShare(pollId, event)}
                              onComment={handleComment}
                              onBookmark={(pollId) => handleBookmark(pollId, event)}
                              isActive={true}
                              className="scale-110"
                            />
                          </motion.div>
                        )
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.main>
        </AdvancedSwipeContainer>
        
        {/* Particle explosion overlay */}
        {explosionActive && (
          <ParticleExplosion
            isActive={explosionActive}
            x={explosionPosition.x}
            y={explosionPosition.y}
            particleCount={30}
            colors={['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']}
            onComplete={() => setExplosionActive(false)}
          />
        )}
        
        {/* Neural Navigation */}
        <NeuralNavigation onCreatePoll={handleCreatePoll} />
      </div>
    </ContextualColorMorph>
  );
};

export default RevolutionaryExplorePage;