import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Gift, Sparkles, Trophy, Zap } from 'lucide-react';

const JackpotExplosion = ({ show, jackpotData, onClose }) => {
  const [explosions, setExplosions] = useState([]);
  const [showRewards, setShowRewards] = useState(false);
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);

  useEffect(() => {
    if (show && jackpotData) {
      // Create multiple explosion points
      const explosionPoints = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98'][i],
        size: Math.random() * 200 + 100
      }));
      setExplosions(explosionPoints);

      // Show rewards after explosion
      setTimeout(() => setShowRewards(true), 2000);

      // Cycle through rewards
      if (jackpotData.rare_rewards && jackpotData.rare_rewards.length > 1) {
        const rewardCycle = setInterval(() => {
          setCurrentRewardIndex(prev => (prev + 1) % jackpotData.rare_rewards.length);
        }, 1500);

        setTimeout(() => clearInterval(rewardCycle), 8000);
      }

      // Auto close after 8 seconds
      setTimeout(() => {
        onClose && onClose();
      }, 8000);
    }
  }, [show, jackpotData, onClose]);

  if (!show || !jackpotData) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Full screen overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Multiple explosion effects */}
        {explosions.map(explosion => (
          <motion.div
            key={explosion.id}
            className="absolute pointer-events-none"
            style={{
              left: explosion.x - explosion.size / 2,
              top: explosion.y - explosion.size / 2,
              width: explosion.size,
              height: explosion.size
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1.5, 0],
              rotate: 360,
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2,
              ease: "easeOut",
              delay: explosion.id * 0.1
            }}
          >
            {/* Explosion particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{ 
                  backgroundColor: explosion.color,
                  left: '50%',
                  top: '50%'
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * explosion.size],
                  y: [0, (Math.random() - 0.5) * explosion.size],
                  opacity: [1, 0],
                  scale: [1, 0]
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  delay: explosion.id * 0.1 + i * 0.05
                }}
              />
            ))}
          </motion.div>
        ))}

        {/* Fireworks effects */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`firework-${i}`}
            className="absolute"
            style={{
              left: `${10 + (i % 4) * 20}%`,
              top: `${10 + Math.floor(i / 4) * 25}%`
            }}
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1, 0],
            }}
            transition={{ 
              duration: 1.5,
              delay: 1 + i * 0.2,
              ease: "easeOut"
            }}
          >
            {/* Firework burst */}
            {[...Array(16)].map((_, j) => (
              <motion.div
                key={j}
                className="absolute w-2 h-12 bg-yellow-400 rounded-full"
                style={{
                  transformOrigin: 'bottom center',
                  transform: `rotate(${j * 22.5}deg)`
                }}
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ 
                  scaleY: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: 1,
                  delay: 1 + i * 0.2
                }}
              />
            ))}
          </motion.div>
        ))}

        {/* Main jackpot content */}
        <motion.div
          className="relative pointer-events-auto"
          initial={{ scale: 0, y: 100, rotate: -90 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0, y: -100, rotate: 90 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 1.5
          }}
        >
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 via-pink-500 to-purple-600 p-12 rounded-3xl shadow-2xl border-4 border-white/30 text-center min-w-[500px] relative overflow-hidden">
            
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 2px, transparent 2px)',
                backgroundSize: '30px 30px'
              }}
              animate={{
                backgroundPosition: ['0px 0px', '30px 30px', '0px 0px']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Giant diamond/crown icon */}
            <motion.div
              className="relative inline-flex items-center justify-center w-32 h-32 bg-white/20 rounded-full mb-8 mx-auto"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Crown className="w-16 h-16 text-yellow-200" />
              
              {/* Orbiting sparkles */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-6 text-white"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${angle}deg) translateY(-60px) translateX(-12px)`
                  }}
                  animate={{
                    rotate: [angle, angle + 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.2
                  }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              ))}
            </motion.div>

            {/* JACKPOT text with extreme effects */}
            <motion.h1
              className="text-8xl font-black text-white mb-6"
              style={{
                textShadow: '0 0 30px rgba(255,255,255,1), 0 0 60px rgba(255,215,0,0.8), 0 0 90px rgba(255,215,0,0.6)',
                background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700, #FFA500)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: [
                  '0 0 30px rgba(255,255,255,1), 0 0 60px rgba(255,215,0,0.8)',
                  '0 0 40px rgba(255,255,255,1), 0 0 80px rgba(255,215,0,1)',
                  '0 0 30px rgba(255,255,255,1), 0 0 60px rgba(255,215,0,0.8)'
                ]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              JACKPOT!
            </motion.h1>

            {/* XP Bonus */}
            <motion.div
              className="text-6xl font-bold text-white mb-6"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity
              }}
            >
              +{jackpotData.xp_bonus.toLocaleString()} XP
            </motion.div>

            {/* Rare rewards showcase */}
            {showRewards && jackpotData.rare_rewards && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentRewardIndex}
                    className="bg-white/20 p-6 rounded-2xl border-2 border-white/30"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Trophy className="w-8 h-8 text-yellow-300" />
                      <span className="text-2xl font-bold text-white">
                        {jackpotData.rare_rewards[currentRewardIndex]?.replace('_', ' ').toUpperCase() || 'RECOMPENSA ESPECIAL'}
                      </span>
                      <Gift className="w-8 h-8 text-pink-300" />
                    </div>
                    
                    <div className="text-white/90 text-lg">
                      🏆 Objeto ultra-raro desbloqueado
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Progress dots for multiple rewards */}
                {jackpotData.rare_rewards.length > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {jackpotData.rare_rewards.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === currentRewardIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                        animate={index === currentRewardIndex ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Achievement badge */}
            {jackpotData.achievement && (
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl mb-6 border-2 border-white/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 3, type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <Star className="w-6 h-6 text-yellow-300" />
                  <span className="text-white font-bold text-lg">
                    {jackpotData.achievement.name}
                  </span>
                  <Star className="w-6 h-6 text-yellow-300" />
                </div>
              </motion.div>
            )}

            <motion.div
              className="text-white/80 text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4 }}
            >
              {jackpotData.message || '🎉 ¡Has ganado el premio más grande! 🎉'}
            </motion.div>
          </div>

          {/* Multiple pulsing rings */}
          {[1, 2, 3, 4].map((ring, i) => (
            <motion.div
              key={ring}
              className="absolute inset-0 border-4 border-white/20 rounded-3xl"
              animate={{
                scale: [1, 1.5 + i * 0.3, 1],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Screen shake effect */}
        <motion.div
          className="fixed inset-0 pointer-events-none"
          animate={{
            x: [0, -5, 5, -5, 5, 0],
            y: [0, 5, -5, 5, -5, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: 5,
            delay: 1
          }}
        />

        {/* Golden rain effect */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`gold-${i}`}
            className="absolute w-2 h-8 bg-yellow-400 rounded-full pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px'
            }}
            animate={{
              y: window.innerHeight + 50,
              rotate: [0, 360, 720],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: 2 + Math.random() * 3,
              ease: "easeIn"
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default JackpotExplosion;