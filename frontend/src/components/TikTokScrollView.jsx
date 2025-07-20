import React, { useEffect, useRef, useState, useCallback } from 'react';
import PollCard from './PollCard';
import { cn } from '../lib/utils';
import { Grid3X3, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

const TikTokPollCard = ({ poll, onVote, onLike, onShare, onComment, isActive, index, total }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center relative snap-start snap-always bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Full screen poll card container - perfectly centered */}
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-sm sm:max-w-md h-full flex flex-col justify-center">
          <div className="transform transition-transform duration-300 h-full flex flex-col justify-center">
            <PollCard
              poll={poll}
              onVote={onVote}
              onLike={onLike}
              onShare={onShare}
              onComment={onComment}
              fullScreen={true}
            />
          </div>
        </div>
      </div>
      
      {/* Progress indicator - minimal and floating */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 z-20">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 h-6 rounded-full transition-all duration-300",
              i === index
                ? "bg-white shadow-lg"
                : "bg-white/30"
            )}
          />
        ))}
      </div>

      {/* Subtle scroll hints - only show on first card */}
      {index === 0 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20">
          <ChevronDown className="w-6 h-6 text-white/70" />
          <p className="text-white/70 text-sm font-medium">Desliza para ver más</p>
        </div>
      )}
    </div>
  );
};

const TikTokScrollView = ({ polls, onVote, onLike, onShare, onComment, onExitTikTok }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Improved scroll handling with throttling
  const handleScroll = useCallback(() => {
    if (isScrolling) return;
    
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / containerHeight);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < polls.length) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, polls.length, isScrolling]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout;
    const throttledScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        handleScroll();
      }, 100);
    };

    container.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', throttledScroll);
      clearTimeout(scrollTimeout);
    };
  }, [handleScroll]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      const container = containerRef.current;
      if (!container) return;

      if (event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault();
        const nextIndex = Math.min(activeIndex + 1, polls.length - 1);
        if (nextIndex !== activeIndex) {
          container.scrollTo({
            top: nextIndex * container.clientHeight,
            behavior: 'smooth'
          });
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = Math.max(activeIndex - 1, 0);
        if (prevIndex !== activeIndex) {
          container.scrollTo({
            top: prevIndex * container.clientHeight,
            behavior: 'smooth'
          });
        }
      } else if (event.key === 'Escape') {
        onExitTikTok?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, polls.length, onExitTikTok]);

  // Touch/swipe support for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      const deltaY = startY - endY;
      const deltaTime = endTime - startTime;

      // Swipe detection (minimum distance and maximum time)
      if (Math.abs(deltaY) > 50 && deltaTime < 300) {
        if (deltaY > 0 && activeIndex < polls.length - 1) {
          // Swipe up - next
          container.scrollTo({
            top: (activeIndex + 1) * container.clientHeight,
            behavior: 'smooth'
          });
        } else if (deltaY < 0 && activeIndex > 0) {
          // Swipe down - previous
          container.scrollTo({
            top: (activeIndex - 1) * container.clientHeight,
            behavior: 'smooth'
          });
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeIndex, polls.length]);

  if (!polls.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m0 0V1a1 1 0 011-1h4a1 1 0 011 1v3M7 4a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No hay votaciones</h3>
          <p className="text-gray-400">No se encontraron votaciones para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Exit button - floating and minimal */}
      <Button
        onClick={onExitTikTok}
        className="fixed top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm border-none p-2 h-10 w-10 rounded-full"
        size="sm"
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>

      {/* Navigation hints - minimal */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-4">
        <Button
          onClick={() => {
            const container = containerRef.current;
            if (container && activeIndex > 0) {
              container.scrollTo({
                top: (activeIndex - 1) * container.clientHeight,
                behavior: 'smooth'
              });
            }
          }}
          disabled={activeIndex === 0}
          className="bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm border-none p-2 h-8 w-8 rounded-full disabled:opacity-30"
          size="sm"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => {
            const container = containerRef.current;
            if (container && activeIndex < polls.length - 1) {
              container.scrollTo({
                top: (activeIndex + 1) * container.clientHeight,
                behavior: 'smooth'
              });
            }
          }}
          disabled={activeIndex === polls.length - 1}
          className="bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm border-none p-2 h-8 w-8 rounded-full disabled:opacity-30"
          size="sm"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Main scroll container - full screen */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-hide snap-y snap-mandatory"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {polls.map((poll, index) => (
          <TikTokPollCard
            key={poll.id}
            poll={poll}
            onVote={onVote}
            onLike={onLike}
            onShare={onShare}
            onComment={onComment}
            isActive={index === activeIndex}
            index={index}
            total={polls.length}
          />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Enhanced snap behavior */
        .snap-y {
          scroll-snap-type: y mandatory;
        }
        
        .snap-start {
          scroll-snap-align: start;
        }
        
        .snap-always {
          scroll-snap-stop: always;
        }

        /* Prevent overscroll */
        body {
          overscroll-behavior: none;
        }
      `}</style>
    </div>
  );
};

export default TikTokScrollView;