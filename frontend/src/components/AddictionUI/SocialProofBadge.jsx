import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, TrendingUp, Users, Flame } from 'lucide-react';

const SocialProofBadge = ({ 
  pollId, 
  socialProof, 
  onLoadProof,
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentProof, setCurrentProof] = useState(socialProof);

  useEffect(() => {
    // Load social proof data
    if (onLoadProof && !currentProof) {
      onLoadProof(pollId).then(proof => {
        setCurrentProof(proof);
        setIsVisible(true);
      });
    } else if (currentProof) {
      setIsVisible(true);
    }

    // Refresh social proof every 30 seconds
    const interval = setInterval(() => {
      if (onLoadProof) {
        onLoadProof(pollId).then(proof => {
          setCurrentProof(proof);
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [pollId, onLoadProof, currentProof]);

  if (!currentProof || !isVisible) return null;

  const getBadgeColor = () => {
    const pressure = currentProof.social_pressure_score;
    if (pressure >= 8) return 'from-red-500 to-pink-600';
    if (pressure >= 6) return 'from-orange-500 to-red-600';
    if (pressure >= 4) return 'from-yellow-500 to-orange-600';
    return 'from-blue-500 to-purple-600';
  };

  const getUrgencyText = () => {
    const pressure = currentProof.social_pressure_score;
    const count = currentProof.active_voters_count;
    
    if (pressure >= 8) return `🔥 ¡${count} personas votando AHORA!`;
    if (pressure >= 6) return `⚡ ${count} usuarios activos`;
    if (pressure >= 4) return `👥 ${count} personas participando`;
    return `👀 ${count} viendo esta encuesta`;
  };

  const getIcon = () => {
    const pressure = currentProof.social_pressure_score;
    if (pressure >= 8) return <Flame className="w-4 h-4" />;
    if (pressure >= 6) return <TrendingUp className="w-4 h-4" />;
    if (pressure >= 4) return <Users className="w-4 h-4" />;
    return <Eye className="w-4 h-4" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`inline-flex ${className}`}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.div
          className={`bg-gradient-to-r ${getBadgeColor()} px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-2`}
          animate={currentProof.social_pressure_score >= 6 ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 4px 20px rgba(0,0,0,0.1)',
              '0 4px 30px rgba(255,100,100,0.3)',
              '0 4px 20px rgba(0,0,0,0.1)'
            ]
          } : {}}
          transition={{ 
            duration: 2,
            repeat: currentProof.social_pressure_score >= 6 ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Icon with pulse effect for high pressure */}
          <motion.div
            className="text-white"
            animate={currentProof.social_pressure_score >= 8 ? {
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ 
              duration: 1,
              repeat: currentProof.social_pressure_score >= 8 ? Infinity : 0
            }}
          >
            {getIcon()}
          </motion.div>

          {/* Main text */}
          <span className="text-white font-semibold text-sm whitespace-nowrap">
            {getUrgencyText()}
          </span>

          {/* Trending indicator */}
          {currentProof.trending_momentum > 3 && (
            <motion.div
              className="bg-white/20 px-2 py-0.5 rounded-full"
              animate={{ 
                backgroundColor: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity
              }}
            >
              <span className="text-xs font-bold text-white">VIRAL</span>
            </motion.div>
          )}
        </motion.div>

        {/* Recent voters list */}
        {currentProof.recent_voters && currentProof.recent_voters.length > 0 && (
          <motion.div
            className="ml-2 flex -space-x-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {currentProof.recent_voters.slice(0, 3).map((voter, index) => (
              <motion.div
                key={voter}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                title={`Usuario reciente: ${voter}`}
              >
                <span className="text-xs text-white font-bold">
                  {voter.charAt(0).toUpperCase()}
                </span>
              </motion.div>
            ))}
            
            {currentProof.recent_voters.length > 3 && (
              <motion.div
                className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
              >
                <span className="text-xs text-gray-600 font-bold">
                  +{currentProof.recent_voters.length - 3}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Momentum indicator */}
        {currentProof.trending_momentum > 2 && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg flex items-center justify-center">
              <span className="text-xs">🔥</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SocialProofBadge;