import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Gift, Crown, Zap } from 'lucide-react';

const RewardPopup = ({ show, reward, onClose }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (show && reward) {
      // Generate confetti particles
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
      }));
      setConfetti(particles);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose && onClose();
      }, 3000);
    }
  }, [show, reward, onClose]);

  if (!show || !reward) return null;

  const getRewardIcon = () => {
    if (reward.rare_reward) return <Crown className="w-8 h-8" />;
    if (reward.xp_gained > 100) return <Star className="w-8 h-8" />;
    if (reward.bonus_multiplier > 1.5) return <Zap className="w-8 h-8" />;
    return <Gift className="w-8 h-8" />;
  };

  const getRewardColor = () => {
    if (reward.rare_reward) return 'from-purple-600 to-pink-600';
    if (reward.xp_gained > 100) return 'from-yellow-500 to-orange-600';
    if (reward.bonus_multiplier > 1.5) return 'from-blue-500 to-purple-600';
    return 'from-green-500 to-teal-600';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background overlay with blur */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        
        {/* Confetti particles */}
        {confetti.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{ backgroundColor: particle.color }}
            initial={{ 
              x: particle.x,
              y: particle.y,
              scale: 0,
              rotate: 0
            }}
            animate={{ 
              y: particle.y + 200,
              scale: [0, 1, 0],
              rotate: 360
            }}
            transition={{ 
              duration: 2,
              ease: "easeOut",
              delay: Math.random() * 0.5
            }}
          />
        ))}

        {/* Main reward popup */}
        <motion.div
          className="relative pointer-events-auto"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 15 
          }}
        >
          <div className={`bg-gradient-to-br ${getRewardColor()} p-8 rounded-3xl shadow-2xl border-4 border-white/30 min-w-[300px] text-center`}>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse" />
            
            {/* Icon with sparkle effect */}
            <motion.div
              className="relative inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="text-white">
                {getRewardIcon()}
              </div>
              
              {/* Sparkles around icon */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                {[0, 72, 144, 216, 288].map((angle, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${angle}deg) translateY(-30px) translateX(-4px)`
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Reward text */}
            <motion.h2
              className="text-2xl font-bold text-white mb-2"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {reward.rare_reward ? '🎉 ¡RECOMPENSA RARA!' : '✨ ¡Recompensa Ganada!'}
            </motion.h2>

            <div className="text-white/90 mb-4">
              <div className="text-3xl font-bold mb-1">
                +{reward.xp_gained} XP
              </div>
              
              {reward.bonus_multiplier > 1 && (
                <div className="text-sm">
                  Multiplicador de racha: x{reward.bonus_multiplier.toFixed(1)}
                </div>
              )}
              
              {reward.rare_reward && (
                <motion.div 
                  className="text-yellow-300 font-semibold mt-2"
                  animate={{ 
                    textShadow: [
                      '0 0 5px #FFD700',
                      '0 0 20px #FFD700',
                      '0 0 5px #FFD700'
                    ]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity
                  }}
                >
                  🏆 {reward.rare_reward.replace('_', ' ').toUpperCase()}
                </motion.div>
              )}
            </div>

            {/* Action type */}
            <div className="text-white/70 text-sm capitalize">
              {reward.event_type === 'vote' ? 'Por votar' : 
               reward.event_type === 'create' ? 'Por crear encuesta' :
               reward.event_type === 'share' ? 'Por compartir' :
               reward.event_type === 'daily_login' ? 'Login diario' :
               'Por participar'}
            </div>
          </div>

          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 border-2 border-white/50 rounded-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute inset-0 border-2 border-white/30 rounded-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RewardPopup;