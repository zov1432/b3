import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Award, Crown, Star, Zap, Trophy, Target, Medal } from 'lucide-react';

const AchievementToast = ({ show, achievement, onClose }) => {
  if (!show || !achievement) return null;

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'voter': return <CheckCircle className="w-6 h-6" />;
      case 'creator': return <Award className="w-6 h-6" />;
      case 'streak': return <Zap className="w-6 h-6" />;
      case 'social': return <Trophy className="w-6 h-6" />;
      case 'special': return <Crown className="w-6 h-6" />;
      default: return <Medal className="w-6 h-6" />;
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'legendary': return '0 0 30px rgba(255, 215, 0, 0.8)';
      case 'epic': return '0 0 20px rgba(147, 51, 234, 0.6)';
      case 'rare': return '0 0 15px rgba(59, 130, 246, 0.6)';
      default: return '0 0 10px rgba(34, 197, 94, 0.4)';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-[9998] pointer-events-none"
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} p-4 rounded-2xl shadow-2xl border-2 border-white/30 min-w-[350px] pointer-events-auto cursor-pointer`}
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ 
            boxShadow: getRarityGlow(achievement.rarity)
          }}
        >
          <div className="flex items-start gap-3">
            {/* Achievement icon with animation */}
            <motion.div
              className="bg-white/20 p-2 rounded-full flex-shrink-0"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-white">
                {achievement.icon ? (
                  <span className="text-2xl">{achievement.icon}</span>
                ) : (
                  getAchievementIcon(achievement.type)
                )}
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-bold text-lg truncate">
                  {achievement.name}
                </h3>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  achievement.rarity === 'legendary' ? 'bg-yellow-500 text-black' :
                  achievement.rarity === 'epic' ? 'bg-purple-600 text-white' :
                  achievement.rarity === 'rare' ? 'bg-blue-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {achievement.rarity.toUpperCase()}
                </span>
              </div>

              {/* Description */}
              <p className="text-white/90 text-sm mb-2 leading-tight">
                {achievement.description}
              </p>

              {/* XP Reward */}
              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm">
                  🎉 Logro desbloqueado
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-white font-bold text-sm">
                    +{achievement.xp_reward} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Close button */}
            <motion.button
              className="text-white/60 hover:text-white p-1"
              onClick={(e) => {
                e.stopPropagation();
                onClose && onClose();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>

          {/* Animated border */}
          <motion.div
            className="absolute inset-0 border-2 border-white/50 rounded-2xl"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Sparkle effects for legendary achievements */}
          {achievement.rarity === 'legendary' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Toast notification sound effect indicator */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full"
          animate={{
            scale: [0, 1.2, 0],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 1,
            repeat: 3
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementToast;