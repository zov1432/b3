import React from 'react';
import { motion } from 'framer-motion';
import { Star, Crown, Zap } from 'lucide-react';

const ProgressBar = ({ 
  level, 
  xp, 
  xpToNext, 
  progress,
  streak,
  className = "" 
}) => {
  const getProgressColor = () => {
    if (progress >= 80) return 'from-yellow-500 to-orange-600';
    if (progress >= 60) return 'from-purple-500 to-pink-600';
    if (progress >= 40) return 'from-blue-500 to-cyan-600';
    return 'from-green-500 to-teal-600';
  };

  const getStreakColor = () => {
    if (streak >= 30) return 'text-yellow-500';
    if (streak >= 14) return 'text-purple-500';
    if (streak >= 7) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 ${className}`}>
      {/* Header with Level and Streak */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-2 rounded-full">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">Nivel {level}</div>
            <div className="text-xs text-gray-600">{xp.toLocaleString()} XP Total</div>
          </div>
        </div>
        
        {streak > 0 && (
          <div className="text-right">
            <div className={`text-lg font-bold ${getStreakColor()}`}>
              🔥 {streak}
            </div>
            <div className="text-xs text-gray-600">día{streak !== 1 ? 's' : ''}</div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          
          {/* Progress fill with animation */}
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()} relative overflow-hidden`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut"
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear"
              }}
              style={{ width: '100px' }}
            />
            
            {/* Particle effects for high progress */}
            {progress > 80 && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 w-1 h-1 bg-white rounded-full"
                    animate={{
                      x: [0, 20, 0],
                      y: [-2, 2, -2],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                    style={{
                      left: `${10 + i * 30}%`,
                      transform: 'translateY(-50%)'
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
          
          {/* Milestone markers */}
          {[25, 50, 75].map(milestone => (
            <div
              key={milestone}
              className="absolute top-0 bottom-0 w-0.5 bg-white/50"
              style={{ left: `${milestone}%` }}
            />
          ))}
        </div>

        {/* XP Text */}
        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="text-gray-600">
            {xpToNext > 0 ? `${xpToNext} XP para nivel ${level + 1}` : '¡Nivel máximo!'}
          </span>
          <span className="font-bold text-gray-800">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Streak bonus indicator */}
      {streak > 0 && (
        <motion.div
          className="mt-3 p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg border border-orange-200"
          animate={{ 
            backgroundColor: ['rgba(251, 146, 60, 0.1)', 'rgba(251, 146, 60, 0.2)', 'rgba(251, 146, 60, 0.1)']
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">
                Multiplicador de Racha
              </span>
            </div>
            <span className="text-sm font-bold text-orange-600">
              x{(1 + streak * 0.1).toFixed(1)}
            </span>
          </div>
        </motion.div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-lg font-bold text-blue-700">{level}</div>
          <div className="text-xs text-blue-600">Nivel</div>
        </div>
        
        <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-lg font-bold text-purple-700">
            {Math.floor(xp / 1000)}K
          </div>
          <div className="text-xs text-purple-600">XP Total</div>
        </div>
        
        <div className="text-center p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="text-lg font-bold text-green-700">{streak}</div>
          <div className="text-xs text-green-600">Racha</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;