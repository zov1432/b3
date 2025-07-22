import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Zap, Trophy } from 'lucide-react';

const LevelUpAnimation = ({ show, level, onClose }) => {
  const [particles, setParticles] = useState([]);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (show) {
      // Generate particle effects
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        size: Math.random() * 8 + 4,
        color: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#32CD32'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
      
      // Trigger fireworks after 1 second
      setTimeout(() => setShowFireworks(true), 1000);
      
      // Auto close after 4 seconds
      setTimeout(() => {
        onClose && onClose();
      }, 4000);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Floating particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{ 
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size
            }}
            initial={{ 
              x: particle.x,
              y: particle.y,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              y: -100,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: 360
            }}
            transition={{ 
              duration: 3,
              ease: "easeOut",
              delay: particle.delay
            }}
          />
        ))}

        {/* Fireworks */}
        {showFireworks && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`firework-${i}`}
                className="absolute"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${20 + (i % 2) * 30}%`
                }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                }}
                transition={{ 
                  duration: 1,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              >
                {[...Array(12)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="absolute w-1 h-8 bg-yellow-400 rounded-full"
                    style={{
                      transformOrigin: 'bottom center',
                      transform: `rotate(${j * 30}deg)`
                    }}
                    initial={{ scaleY: 0, opacity: 1 }}
                    animate={{ 
                      scaleY: [0, 1, 0],
                      opacity: [1, 1, 0]
                    }}
                    transition={{ 
                      duration: 0.8,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </motion.div>
            ))}
          </>
        )}

        {/* Main level up content */}
        <motion.div
          className="relative pointer-events-auto"
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, y: -100 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
        >
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600 p-12 rounded-3xl shadow-2xl border-4 border-white/30 text-center min-w-[400px]">
            
            {/* Animated crown */}
            <motion.div
              className="relative inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 mx-auto"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Crown className="w-12 h-12 text-yellow-200" />
              
              {/* Orbiting stars */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 text-yellow-200"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${angle}deg) translateY(-40px) translateX(-8px)`
                  }}
                  animate={{
                    rotate: [angle, angle + 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Star className="w-4 h-4" />
                </motion.div>
              ))}
            </motion.div>

            {/* Level up text with glow effect */}
            <motion.h1
              className="text-5xl font-bold text-white mb-4"
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.6)'
              }}
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: [
                  '0 0 20px rgba(255,255,255,0.8)',
                  '0 0 40px rgba(255,255,255,1)',
                  '0 0 20px rgba(255,255,255,0.8)'
                ]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              ¡NIVEL {level}!
            </motion.h1>

            <motion.div
              className="text-xl text-white/90 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              🎉 ¡Felicidades! ¡Has subido de nivel! 🎉
            </motion.div>

            {/* Achievement badges */}
            <motion.div
              className="flex justify-center gap-4 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="bg-white/20 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-200" />
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Zap className="w-6 h-6 text-blue-200" />
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Star className="w-6 h-6 text-purple-200" />
              </div>
            </motion.div>

            {/* Level benefits */}
            <motion.div
              className="text-white/80 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              • Nuevos privilegios desbloqueados<br/>
              • Multiplicador de XP aumentado<br/>
              • Acceso a contenido exclusivo
            </motion.div>
          </div>

          {/* Pulsing rings */}
          {[1, 2, 3].map((ring, i) => (
            <motion.div
              key={ring}
              className="absolute inset-0 border-4 border-white/30 rounded-3xl"
              animate={{
                scale: [1, 1.3 + i * 0.2, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Background rays */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default LevelUpAnimation;