import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, TrendingUp, Users, X } from 'lucide-react';

const FOMOAlert = ({ 
  fomoContent, 
  onClose,
  onTakeAction,
  className = "" 
}) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (fomoContent && fomoContent.length > 0) {
      // Calculate time left for current FOMO content
      const current = fomoContent[currentIndex];
      const updateTimeLeft = () => {
        const now = new Date();
        const expires = new Date(current.expires_at);
        const diff = expires - now;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft({ hours, minutes, seconds });
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        }
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);

      return () => clearInterval(interval);
    }
  }, [fomoContent, currentIndex]);

  useEffect(() => {
    // Rotate through FOMO content every 10 seconds
    if (fomoContent && fomoContent.length > 1) {
      const rotateInterval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % fomoContent.length);
      }, 10000);

      return () => clearInterval(rotateInterval);
    }
  }, [fomoContent]);

  if (!fomoContent || fomoContent.length === 0) return null;

  const currentFOMO = fomoContent[currentIndex];
  const urgencyLevel = currentFOMO.urgency_level;

  const getUrgencyColor = () => {
    if (urgencyLevel >= 5) return 'from-red-600 to-pink-700';
    if (urgencyLevel >= 4) return 'from-orange-600 to-red-600';
    if (urgencyLevel >= 3) return 'from-yellow-600 to-orange-600';
    return 'from-blue-600 to-purple-600';
  };

  const getUrgencyText = () => {
    if (urgencyLevel >= 5) return '🚨 EXTREMADAMENTE URGENTE';
    if (urgencyLevel >= 4) return '⚡ MUY URGENTE';
    if (urgencyLevel >= 3) return '🔥 URGENTE';
    return '⏰ LIMITADO';
  };

  const formatTime = () => {
    if (!timeLeft) return '';
    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m`;
    }
    return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
  };

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-[99999] ${className}`}
      style={{ pointerEvents: 'auto' }}
    >
      <div>
        <div
          className={`bg-gradient-to-r ${getUrgencyColor()} p-4 rounded-2xl shadow-2xl border-2 border-white/30`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1 rounded-full">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              
              <span className="text-white font-bold text-sm">
                {getUrgencyText()}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose && onClose();
              }}
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto' }}
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-white font-bold text-lg mb-2 leading-tight">
              {currentFOMO.title}
            </h3>

            <div className="flex items-center gap-4 mb-3">
              {/* Time left */}
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">
                  {formatTime()} restante{timeLeft?.hours === 0 && timeLeft?.minutes < 5 ? 's ⚠️' : ''}
                </span>
              </div>

              {/* Participants */}
              {currentFOMO.current_participants > 0 && (
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white font-bold text-sm">
                    {currentFOMO.current_participants}
                    {currentFOMO.max_participants && `/${currentFOMO.max_participants}`}
                  </span>
                </div>
              )}

              {/* Trending indicator */}
              {currentFOMO.is_trending && (
                <motion.div
                  className="flex items-center gap-1 bg-yellow-500/80 px-3 py-1 rounded-full"
                  animate={{ 
                    backgroundColor: ['rgba(234, 179, 8, 0.8)', 'rgba(251, 191, 36, 0.9)', 'rgba(234, 179, 8, 0.8)']
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity
                  }}
                >
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span className="text-white font-bold text-sm">VIRAL</span>
                </motion.div>
              )}
            </div>

            {/* Participation limit warning */}
            {currentFOMO.max_participants && 
             currentFOMO.current_participants / currentFOMO.max_participants > 0.8 && (
              <motion.div
                className="bg-red-600/80 p-2 rounded-lg mb-3"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <p className="text-white text-sm font-semibold">
                  ⚠️ Solo quedan {currentFOMO.max_participants - currentFOMO.current_participants} lugares
                </p>
              </motion.div>
            )}
          </div>

          {/* Action button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Participar button clicked!'); // Debug log
              onTakeAction && onTakeAction(currentFOMO);
            }}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm border border-white/30 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
            type="button"
          >
            <span>¡Participar Ahora!</span>
            {urgencyLevel >= 4 && (
              <span>⚡</span>
            )}
          </button>

          {/* Progress indicator for multiple FOMO items */}
          {fomoContent.length > 1 && (
            <div className="flex justify-center mt-3 gap-2">
              {fomoContent.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  animate={index === currentIndex ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              ))}
            </div>
          )}

          {/* Animated border for high urgency */}
          {urgencyLevel >= 4 && (
            <motion.div
              className="absolute inset-0 border-2 border-white/60 rounded-2xl"
              animate={{
                opacity: [0.6, 1, 0.6],
                borderWidth: ['2px', '4px', '2px']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* Pulsing effect for extreme urgency */}
        {urgencyLevel >= 5 && timeLeft && timeLeft.minutes < 5 && (
          <motion.div
            className="absolute inset-0 bg-red-600/20 rounded-2xl pointer-events-none"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FOMOAlert;