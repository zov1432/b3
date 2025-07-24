import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Home, Compass, Plus, MessageCircle, User, 
  Sparkles, Zap, Heart, Music, Camera,
  Settings, Search, Bell, Archive
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useAddiction } from '../contexts/AddictionContext';
import CreatePollModal from './CreatePollModal';

// Neural color adaptation based on time and user behavior
const useNeuralTheme = () => {
  const [theme, setTheme] = useState('dawn');
  const { userProfile } = useAddiction();
  
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      const userLevel = userProfile?.level || 1;
      const userXP = userProfile?.xp || 0;
      
      // Neural adaptation based on time and user stats
      if (hour >= 6 && hour < 12) {
        setTheme(userLevel > 5 ? 'energetic-dawn' : 'dawn');
      } else if (hour >= 12 && hour < 18) {
        setTheme(userXP > 1000 ? 'vibrant-day' : 'day');
      } else if (hour >= 18 && hour < 22) {
        setTheme('sunset');
      } else {
        setTheme(userLevel > 10 ? 'neon-night' : 'night');
      }
    };
    
    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [userProfile]);
  
  const themes = {
    dawn: {
      primary: 'from-rose-400 via-pink-500 to-purple-600',
      secondary: 'from-orange-300 to-rose-400',
      glow: 'shadow-pink-500/50',
      particles: 'bg-gradient-to-r from-yellow-200 to-pink-300'
    },
    'energetic-dawn': {
      primary: 'from-yellow-400 via-orange-500 to-red-600',
      secondary: 'from-amber-300 to-orange-500',
      glow: 'shadow-orange-500/60',
      particles: 'bg-gradient-to-r from-yellow-300 to-red-400'
    },
    day: {
      primary: 'from-blue-400 via-purple-500 to-indigo-600',
      secondary: 'from-cyan-300 to-blue-400',
      glow: 'shadow-blue-500/50',
      particles: 'bg-gradient-to-r from-blue-200 to-purple-300'
    },
    'vibrant-day': {
      primary: 'from-green-400 via-blue-500 to-purple-600',
      secondary: 'from-emerald-300 to-blue-400',
      glow: 'shadow-emerald-500/60',
      particles: 'bg-gradient-to-r from-green-300 to-blue-400'
    },
    sunset: {
      primary: 'from-orange-400 via-red-500 to-purple-600',
      secondary: 'from-yellow-300 to-orange-400',
      glow: 'shadow-red-500/50',
      particles: 'bg-gradient-to-r from-orange-200 to-red-300'
    },
    night: {
      primary: 'from-indigo-600 via-purple-700 to-pink-800',
      secondary: 'from-blue-500 to-indigo-600',
      glow: 'shadow-purple-500/50',
      particles: 'bg-gradient-to-r from-indigo-300 to-purple-400'
    },
    'neon-night': {
      primary: 'from-cyan-400 via-purple-500 to-pink-600',
      secondary: 'from-cyan-300 to-purple-400',
      glow: 'shadow-cyan-500/70',
      particles: 'bg-gradient-to-r from-cyan-200 to-pink-300'
    }
  };
  
  return themes[theme];
};

// Intelligent navigation items that adapt to user behavior
const useIntelligentNavigation = () => {
  const location = useLocation();
  const { userProfile } = useAddiction();
  const [navigationItems, setNavigationItems] = useState([]);
  
  useEffect(() => {
    const userLevel = userProfile?.level || 1;
    const streak = userProfile?.streak || 0;
    
    const baseItems = [
      { id: 'feed', to: '/feed', icon: Home, label: 'Inicio', priority: 1 },
      { id: 'explore', to: '/explore', icon: Compass, label: 'Explorar', priority: 1 },
      { id: 'create', to: null, icon: Plus, label: 'Crear', priority: 1, special: true },
      { id: 'messages', to: '/messages', icon: MessageCircle, label: 'Mensajes', priority: 1 },
      { id: 'profile', to: '/profile', icon: User, label: 'Perfil', priority: 1 }
    ];
    
    // Add intelligent items based on user progression
    const intelligentItems = [];
    
    if (userLevel > 3) {
      intelligentItems.push({
        id: 'discover', to: '/discover', icon: Sparkles, label: 'Descubrir', priority: 2
      });
    }
    
    if (streak > 7) {
      intelligentItems.push({
        id: 'leaderboard', to: '/leaderboard', icon: Zap, label: 'Ranking', priority: 2
      });
    }
    
    if (userLevel > 5) {
      intelligentItems.push({
        id: 'music', to: '/music', icon: Music, label: 'Música', priority: 3
      });
    }
    
    // Combine and sort by priority and current context
    const allItems = [...baseItems, ...intelligentItems].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return 0;
    });
    
    setNavigationItems(allItems);
  }, [userProfile, location]);
  
  return navigationItems;
};

// Floating particle system for enhanced visual feedback
const ParticleSystem = ({ isActive, theme }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (!isActive) return;
    
    const createParticle = () => {
      const particle = {
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2
      };
      
      setParticles(prev => [...prev.slice(-10), particle]);
    };
    
    const interval = setInterval(createParticle, 200);
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className={cn(
              "absolute rounded-full opacity-60",
              theme.particles
            )}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              y: -30
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Advanced navigation orb with morphing capabilities
const NavigationOrb = ({ items, activeId, onItemSelect, theme, onCreatePoll }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const orbRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 400 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!orbRef.current) return;
      
      const rect = orbRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set((event.clientX - centerX) * 0.1);
      mouseY.set((event.clientY - centerY) * 0.1);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  const handleItemClick = (item) => {
    if (item.special) {
      // Handle create poll
      return;
    }
    onItemSelect(item);
    setIsExpanded(false);
  };
  
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        ref={orbRef}
        className="relative"
        style={{ x, y }}
        animate={{ 
          scale: isExpanded ? 1.1 : 1,
          rotate: isExpanded ? 360 : 0 
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Main Orb */}
        <motion.div
          className={cn(
            "relative w-16 h-16 rounded-full cursor-pointer",
            "bg-gradient-to-r", theme.primary,
            "shadow-2xl", theme.glow,
            "border-2 border-white/20 backdrop-blur-lg"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          animate={{
            boxShadow: isExpanded 
              ? `0 0 30px ${theme.glow.split('/')[0].split('-')[1]}`
              : `0 0 20px ${theme.glow.split('/')[0].split('-')[1]}`
          }}
        >
          {/* Particle System */}
          <ParticleSystem isActive={isExpanded} theme={theme} />
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          
          {/* Pulse rings */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full border-2 border-white/30"
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Expanded Navigation Items */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, staggerChildren: 0.05 }}
            >
              <div className="flex flex-col items-center gap-3">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    {item.special ? (
                      <CreatePollModal onCreatePoll={onCreatePoll}>
                        <motion.button
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl",
                            "bg-gradient-to-r", theme.secondary,
                            "text-white font-medium shadow-lg",
                            "border border-white/20 backdrop-blur-lg",
                            activeId === item.id && "ring-2 ring-white/50"
                          )}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: `0 8px 25px ${theme.glow.split('/')[0].split('-')[1]}`
                          }}
                          whileTap={{ scale: 0.95 }}
                          onHoverStart={() => setHoveredItem(item.id)}
                          onHoverEnd={() => setHoveredItem(null)}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="text-sm">{item.label}</span>
                          
                          {/* Special glow for create button */}
                          <motion.div
                            className="absolute inset-0 rounded-2xl bg-white/10"
                            animate={{
                              opacity: hoveredItem === item.id ? 1 : 0
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.button>
                      </CreatePollModal>
                    ) : (
                      <motion.button
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-2xl",
                          "bg-gradient-to-r", theme.secondary,
                          "text-white font-medium shadow-lg",
                          "border border-white/20 backdrop-blur-lg",
                          activeId === item.id && "ring-2 ring-white/50"
                        )}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: `0 8px 25px ${theme.glow.split('/')[0].split('-')[1]}`
                        }}
                        whileTap={{ scale: 0.95 }}
                        onHoverStart={() => setHoveredItem(item.id)}
                        onHoverEnd={() => setHoveredItem(null)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm">{item.label}</span>
                        
                        {/* Hover glow effect */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-white/10"
                          animate={{
                            opacity: hoveredItem === item.id ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Main Neural Navigation Component
const NeuralNavigation = ({ onCreatePoll }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useNeuralTheme();
  const navigationItems = useIntelligentNavigation();
  
  const activeId = navigationItems.find(item => item.to === location.pathname)?.id || 'feed';
  
  const handleItemSelect = (item) => {
    if (item.to) {
      navigate(item.to);
    }
  };
  
  return (
    <NavigationOrb
      items={navigationItems}
      activeId={activeId}
      onItemSelect={handleItemSelect}
      theme={theme}
      onCreatePoll={onCreatePoll}
    />
  );
};

export default NeuralNavigation;