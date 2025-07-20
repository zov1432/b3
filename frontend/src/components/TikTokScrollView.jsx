import React, { useEffect, useRef, useState } from 'react';
import PollCard from './PollCard';
import { cn } from '../lib/utils';

const TikTokPollCard = ({ poll, onVote, onLike, onShare, onComment, isActive }) => {
  return (
    <div className={cn(
      "w-full h-screen flex items-center justify-center p-4 snap-start relative",
      "bg-gradient-to-br from-blue-50 via-white to-purple-50"
    )}>
      {/* Full screen poll card container */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col justify-center">
        <div className="transform scale-100 transition-transform duration-300">
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
      
      {/* Optional: Add scroll indicator */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:flex flex-col gap-2">
        <div className="w-1 h-8 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="w-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ height: isActive ? '100%' : '20%' }}
          />
        </div>
      </div>
    </div>
  );
};

const TikTokScrollView = ({ polls, onVote, onLike, onShare, onComment }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / containerHeight);
      setActiveIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      const container = containerRef.current;
      if (!container) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = Math.min(activeIndex + 1, polls.length - 1);
        container.scrollTo({
          top: nextIndex * container.clientHeight,
          behavior: 'smooth'
        });
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = Math.max(activeIndex - 1, 0);
        container.scrollTo({
          top: prevIndex * container.clientHeight,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, polls.length]);

  if (!polls.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m0 0V1a1 1 0 011-1h4a1 1 0 011 1v3M7 4a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay votaciones</h3>
          <p className="text-gray-600">No se encontraron votaciones para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div 
        ref={containerRef}
        className={cn(
          "w-full h-full overflow-y-scroll overflow-x-hidden",
          "snap-y snap-mandatory",
          "scrollbar-hide"
        )}
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
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
          />
        ))}
      </div>

      {/* Navigation dots (optional) */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 z-10">
        {polls.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const container = containerRef.current;
              if (container) {
                container.scrollTo({
                  top: index * container.clientHeight,
                  behavior: 'smooth'
                });
              }
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === activeIndex
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white/80"
            )}
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
      `}</style>
    </div>
  );
};

export default TikTokScrollView;