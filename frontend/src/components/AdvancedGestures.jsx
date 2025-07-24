import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '../lib/utils';

// Gesture recognition system
export const useAdvancedGestures = (onGesture) => {
  const [isTracking, setIsTracking] = useState(false);
  const [gestureData, setGestureData] = useState({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
    direction: null,
    fingers: 1,
    startTime: 0,
    duration: 0
  });
  
  const gestureRef = useRef(null);
  
  const handlePanStart = useCallback((event, info) => {
    setIsTracking(true);
    const startTime = Date.now();
    const startData = {
      startX: info.point.x,
      startY: info.point.y,
      currentX: info.point.x,
      currentY: info.point.y,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
      direction: null,
      fingers: event.touches?.length || 1,
      startTime,
      duration: 0
    };
    
    setGestureData(startData);
  }, []);
  
  const handlePan = useCallback((event, info) => {
    if (!isTracking) return;
    
    const currentTime = Date.now();
    const deltaX = info.point.x - gestureData.startX;
    const deltaY = info.point.y - gestureData.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = currentTime - gestureData.startTime;
    const velocity = distance / (duration || 1);
    
    let direction = null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }
    
    const newGestureData = {
      ...gestureData,
      currentX: info.point.x,
      currentY: info.point.y,
      deltaX,
      deltaY,
      velocity,
      direction,
      duration
    };
    
    setGestureData(newGestureData);
    
    // Real-time gesture feedback
    onGesture?.('pan', newGestureData);
  }, [isTracking, gestureData, onGesture]);
  
  const handlePanEnd = useCallback((event, info) => {
    if (!isTracking) return;
    
    const finalData = {
      ...gestureData,
      currentX: info.point.x,
      currentY: info.point.y,
      deltaX: info.point.x - gestureData.startX,
      deltaY: info.point.y - gestureData.startY,
      velocity: Math.sqrt(info.velocity.x * info.velocity.x + info.velocity.y * info.velocity.y),
      duration: Date.now() - gestureData.startTime
    };
    
    // Determine gesture type based on movement pattern
    const { deltaX, deltaY, velocity, duration, fingers } = finalData;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    let gestureType = 'tap';
    
    // Complex gesture recognition
    if (distance > 50 && velocity > 0.5) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        gestureType = deltaX > 0 ? 'swipe-right' : 'swipe-left';
      } else {
        gestureType = deltaY > 0 ? 'swipe-down' : 'swipe-up';
      }
    } else if (distance > 100 && duration > 500) {
      gestureType = 'drag';
    } else if (fingers > 1) {
      gestureType = 'multi-touch';
    } else if (duration < 200 && distance < 20) {
      gestureType = 'tap';
    } else if (duration > 800 && distance < 30) {
      gestureType = 'long-press';
    }
    
    // Advanced gesture patterns
    if (gestureType.includes('swipe') && velocity > 2) {
      gestureType = `fast-${gestureType}`;
    }
    
    onGesture?.(gestureType, finalData);
    setIsTracking(false);
  }, [isTracking, gestureData, onGesture]);
  
  return {
    gestureProps: {
      onPanStart: handlePanStart,
      onPan: handlePan,
      onPanEnd: handlePanEnd
    },
    gestureData,
    isTracking
  };
};

// Gesture visual feedback component
export const GestureVisualizer = ({ isActive, gestureData, className = "" }) => {
  if (!isActive || !gestureData) return null;
  
  const { startX, startY, currentX, currentY, direction, velocity } = gestureData;
  
  return (
    <div className={cn("absolute inset-0 pointer-events-none z-50", className)}>
      {/* Gesture trail */}
      <motion.div
        className="absolute bg-blue-400/60 rounded-full"
        style={{
          left: Math.min(startX, currentX) - 25,
          top: Math.min(startY, currentY) - 25,
          width: Math.abs(currentX - startX) + 50,
          height: Math.abs(currentY - startY) + 50
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Direction indicator */}
      {direction && (
        <motion.div
          className="absolute flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30"
          style={{
            left: currentX - 32,
            top: currentY - 32
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <div className={cn(
            "w-0 h-0 border-l-8 border-r-8 border-b-8",
            "border-l-transparent border-r-transparent border-b-white",
            direction === 'up' && "rotate-0",
            direction === 'down' && "rotate-180",
            direction === 'left' && "rotate-90",
            direction === 'right' && "-rotate-90"
          )} />
        </motion.div>
      )}
      
      {/* Velocity indicator */}
      <motion.div
        className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {velocity.toFixed(1)} px/ms
      </motion.div>
    </div>
  );
};

// Advanced swipe container with gesture recognition
export const AdvancedSwipeContainer = ({ 
  children, 
  onSwipe, 
  onTap, 
  onLongPress,
  onMultiTouch,
  className = "",
  disabled = false
}) => {
  const [showVisualizer, setShowVisualizer] = useState(false);
  const containerRef = useRef(null);
  
  const handleGesture = useCallback((type, data) => {
    if (disabled) return;
    
    switch (type) {
      case 'tap':
        onTap?.(data);
        break;
      case 'long-press':
        onLongPress?.(data);
        break;
      case 'multi-touch':
        onMultiTouch?.(data);
        break;
      case 'pan':
        // Real-time feedback during pan
        setShowVisualizer(true);
        break;
      default:
        if (type.includes('swipe')) {
          onSwipe?.(type, data);
          setShowVisualizer(false);
        }
        break;
    }
  }, [disabled, onSwipe, onTap, onLongPress, onMultiTouch]);
  
  const { gestureProps, gestureData, isTracking } = useAdvancedGestures(handleGesture);
  
  return (
    <motion.div
      ref={containerRef}
      className={cn("relative touch-manipulation", className)}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'pan-y pan-x'
      }}
      {...gestureProps}
    >
      {children}
      
      <GestureVisualizer 
        isActive={showVisualizer && isTracking}
        gestureData={gestureData}
      />
    </motion.div>
  );
};

// Pinch-to-zoom gesture handler
export const usePinchGesture = (onPinch) => {
  const [isPinching, setIsPinching] = useState(false);
  const [initialDistance, setInitialDistance] = useState(0);
  const [currentScale, setCurrentScale] = useState(1);
  
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        setIsPinching(true);
        const distance = Math.sqrt(
          Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
          Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
        );
        setInitialDistance(distance);
      }
    };
    
    const handleTouchMove = (e) => {
      if (!isPinching || e.touches.length !== 2) return;
      
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      
      const scale = distance / initialDistance;
      setCurrentScale(scale);
      onPinch?.(scale, 'pinch');
    };
    
    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        setIsPinching(false);
        onPinch?.(currentScale, 'pinch-end');
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPinching, initialDistance, currentScale, onPinch]);
  
  return { isPinching, currentScale };
};

// Rotation gesture handler
export const useRotationGesture = (onRotate) => {
  const [isRotating, setIsRotating] = useState(false);
  const [initialAngle, setInitialAngle] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  
  useEffect(() => {
    const getAngle = (touch1, touch2) => {
      return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * 180 / Math.PI;
    };
    
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        setIsRotating(true);
        const angle = getAngle(e.touches[0], e.touches[1]);
        setInitialAngle(angle);
      }
    };
    
    const handleTouchMove = (e) => {
      if (!isRotating || e.touches.length !== 2) return;
      
      const angle = getAngle(e.touches[0], e.touches[1]);
      const rotation = angle - initialAngle;
      setCurrentRotation(rotation);
      onRotate?.(rotation, 'rotate');
    };
    
    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        setIsRotating(false);
        onRotate?.(currentRotation, 'rotate-end');
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isRotating, initialAngle, currentRotation, onRotate]);
  
  return { isRotating, currentRotation };
};

// Haptic feedback simulation (visual)
export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type = 'light', element) => {
    if (!element) return;
    
    // Visual haptic feedback
    const intensity = {
      light: { scale: 1.02, duration: 100 },
      medium: { scale: 1.05, duration: 150 },
      heavy: { scale: 1.08, duration: 200 }
    };
    
    const { scale, duration } = intensity[type] || intensity.light;
    
    element.style.transform = `scale(${scale})`;
    element.style.transition = `transform ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, duration);
    
    // Try native haptic feedback if available
    if (navigator.vibrate) {
      const pattern = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(pattern[type] || pattern.light);
    }
  }, []);
  
  return { triggerHaptic };
};

export default {
  useAdvancedGestures,
  GestureVisualizer,
  AdvancedSwipeContainer,
  usePinchGesture,
  useRotationGesture,
  useHapticFeedback
};