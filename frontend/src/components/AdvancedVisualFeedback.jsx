import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { cn } from '../lib/utils';

// Dynamic morphing shapes that adapt to content
export const MorphingContainer = ({ 
  children, 
  morphType = 'auto', 
  trigger = 'hover',
  duration = 0.6,
  className = ""
}) => {
  const [currentShape, setCurrentShape] = useState('rounded-2xl');
  const [isActive, setIsActive] = useState(false);
  
  const morphShapes = {
    auto: ['rounded-2xl', 'rounded-3xl', 'rounded-full'],
    organic: ['rounded-2xl', 'rounded-[2rem_1rem_3rem_1.5rem]', 'rounded-[1.5rem_3rem_1rem_2rem]'],
    geometric: ['rounded-none', 'rounded-2xl', 'rounded-full'],
    blob: [
      'rounded-2xl',
      'rounded-[3rem_1rem_3rem_1rem]',
      'rounded-[1rem_3rem_1rem_3rem]',
      'rounded-[2rem_3rem_1rem_2rem]'
    ]
  };
  
  const shapes = morphShapes[morphType] || morphShapes.auto;
  
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setCurrentShape(prev => {
        const currentIndex = shapes.indexOf(prev);
        const nextIndex = (currentIndex + 1) % shapes.length;
        return shapes[nextIndex];
      });
    }, duration * 1000);
    
    return () => clearInterval(interval);
  }, [isActive, shapes, duration]);
  
  const handleActivation = useCallback(() => {
    if (trigger === 'hover') {
      setIsActive(true);
    } else if (trigger === 'click') {
      setIsActive(prev => !prev);
    }
  }, [trigger]);
  
  const handleDeactivation = useCallback(() => {
    if (trigger === 'hover') {
      setIsActive(false);
      setCurrentShape(shapes[0]);
    }
  }, [trigger, shapes]);
  
  return (
    <motion.div
      className={cn(currentShape, "transition-all ease-in-out", className)}
      style={{ transitionDuration: `${duration}s` }}
      onMouseEnter={trigger === 'hover' ? handleActivation : undefined}
      onMouseLeave={trigger === 'hover' ? handleDeactivation : undefined}
      onClick={trigger === 'click' ? handleActivation : undefined}
      animate={{
        scale: isActive ? [1, 1.02, 1] : 1
      }}
      transition={{
        scale: { duration: duration * 0.5, repeat: isActive ? Infinity : 0 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Particle explosion system for enhanced feedback
export const ParticleExplosion = ({ 
  isActive, 
  x = 50, 
  y = 50, 
  particleCount = 20,
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'],
  onComplete
}) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (!isActive) return;
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 400,
      vy: (Math.random() - 0.5) * 400,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      life: Math.random() * 2 + 1
    }));
    
    setParticles(newParticles);
    
    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [isActive, x, y, particleCount, colors, onComplete]);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 2
            }}
            initial={{ 
              scale: 0, 
              opacity: 1,
              x: 0,
              y: 0
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [1, 0.8, 0],
              x: particle.vx,
              y: particle.vy
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: particle.life,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Advanced ripple effect system
export const AdvancedRipple = ({ 
  isActive, 
  x = 0, 
  y = 0, 
  color = 'rgba(59, 130, 246, 0.3)',
  size = 'auto',
  duration = 0.8
}) => {
  const rippleRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  
  useEffect(() => {
    if (!isActive) return;
    
    const rippleId = Date.now();
    const newRipple = {
      id: rippleId,
      x,
      y,
      color,
      size: size === 'auto' ? Math.max(window.innerWidth, window.innerHeight) : size
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    const timeout = setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, duration * 1000);
    
    return () => clearTimeout(timeout);
  }, [isActive, x, y, color, size, duration]);
  
  return (
    <div ref={rippleRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: ripple.color,
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{
              duration: duration,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Intelligent micro-animations that respond to user behavior
export const IntelligentMicroAnimation = ({ 
  children, 
  userEngagement = 'low',
  contentType = 'general',
  className = ""
}) => {
  const [animationState, setAnimationState] = useState('idle');
  const controls = useAnimation();
  
  // Engagement-based animation intensity
  const animationConfigs = {
    low: {
      hover: { scale: 1.02, duration: 0.3 },
      active: { scale: 0.98, duration: 0.1 },
      idle: { scale: 1, duration: 0.5 }
    },
    medium: {
      hover: { scale: 1.05, y: -2, duration: 0.3 },
      active: { scale: 0.95, duration: 0.1 },
      idle: { scale: 1, y: 0, duration: 0.5 }
    },
    high: {
      hover: { scale: 1.08, y: -5, rotateZ: 1, duration: 0.4 },
      active: { scale: 0.92, y: 0, rotateZ: 0, duration: 0.1 },
      idle: { scale: 1, y: 0, rotateZ: 0, duration: 0.6 }
    }
  };
  
  const config = animationConfigs[userEngagement] || animationConfigs.low;
  
  // Content-specific animations
  useEffect(() => {
    if (contentType === 'poll' && userEngagement === 'high') {
      // Special poll animations
      controls.start({
        y: [0, -2, 0],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      });
    } else if (contentType === 'reward') {
      // Reward celebration animation
      controls.start({
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.8, repeat: 2 }
      });
    }
  }, [contentType, userEngagement, controls]);
  
  const handleHover = () => {
    setAnimationState('hover');
    controls.start(config.hover);
  };
  
  const handleLeave = () => {
    setAnimationState('idle');
    controls.start(config.idle);
  };
  
  const handleTap = () => {
    setAnimationState('active');
    controls.start(config.active).then(() => {
      controls.start(config.idle);
      setAnimationState('idle');
    });
  };
  
  return (
    <motion.div
      className={cn("cursor-pointer", className)}
      animate={controls}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      onTapStart={handleTap}
      style={{ transformOrigin: 'center' }}
    >
      {children}
    </motion.div>
  );
};

// Progressive morphing layout system
export const ProgressiveMorphLayout = ({ 
  children, 
  stage = 0, 
  stages = 3,
  direction = 'vertical'
}) => {
  const [currentStage, setCurrentStage] = useState(stage);
  
  const layoutConfigs = {
    vertical: {
      0: { flexDirection: 'column', gap: '1rem', padding: '1rem' },
      1: { flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' },
      2: { flexDirection: 'column', gap: '2rem', padding: '2rem' }
    },
    horizontal: {
      0: { flexDirection: 'row', gap: '1rem', padding: '1rem' },
      1: { flexDirection: 'row', gap: '1.5rem', padding: '1.5rem' },
      2: { flexDirection: 'row', gap: '2rem', padding: '2rem' }
    },
    grid: {
      0: { display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' },
      1: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
      2: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }
    }
  };
  
  const config = layoutConfigs[direction] || layoutConfigs.vertical;
  
  useEffect(() => {
    setCurrentStage(Math.min(Math.max(stage, 0), stages - 1));
  }, [stage, stages]);
  
  return (
    <motion.div
      className="w-full"
      animate={config[currentStage]}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
};

// Contextual color morphing system
export const ContextualColorMorph = ({ 
  children, 
  context = 'neutral',
  intensity = 'medium',
  className = ""
}) => {
  const [currentContext, setCurrentContext] = useState(context);
  
  const colorSchemes = {
    neutral: {
      low: 'from-gray-200 to-gray-300',
      medium: 'from-gray-300 to-gray-400',
      high: 'from-gray-400 to-gray-500'
    },
    success: {
      low: 'from-green-200 to-emerald-300',
      medium: 'from-green-300 to-emerald-400',
      high: 'from-green-400 to-emerald-500'
    },
    warning: {
      low: 'from-yellow-200 to-orange-300',
      medium: 'from-yellow-300 to-orange-400',
      high: 'from-yellow-400 to-orange-500'
    },
    error: {
      low: 'from-red-200 to-pink-300',
      medium: 'from-red-300 to-pink-400',
      high: 'from-red-400 to-pink-500'
    },
    info: {
      low: 'from-blue-200 to-indigo-300',
      medium: 'from-blue-300 to-indigo-400',
      high: 'from-blue-400 to-indigo-500'
    },
    energy: {
      low: 'from-purple-200 to-pink-300',
      medium: 'from-purple-300 to-pink-400',
      high: 'from-purple-400 to-pink-500'
    }
  };
  
  const currentScheme = colorSchemes[currentContext]?.[intensity] || colorSchemes.neutral[intensity];
  
  useEffect(() => {
    setCurrentContext(context);
  }, [context]);
  
  return (
    <motion.div
      className={cn(
        "bg-gradient-to-br transition-all duration-1000 ease-in-out",
        currentScheme,
        className
      )}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: '200% 200%'
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  MorphingContainer,
  ParticleExplosion,
  AdvancedRipple,
  IntelligentMicroAnimation,
  ProgressiveMorphLayout,
  ContextualColorMorph
};