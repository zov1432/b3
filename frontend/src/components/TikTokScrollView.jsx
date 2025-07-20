import React, { useEffect, useRef, useState, useCallback } from 'react';
import PollCard from './PollCard';
import { cn } from '../lib/utils';
import { Grid3X3, ChevronUp, ChevronDown, Heart, MessageCircle, Share, MoreHorizontal, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const TikTokPollCard = ({ poll, onVote, onLike, onShare, onComment, isActive, index, total }) => {
  const handleVote = (optionId) => {
    if (!poll.userVote) {
      onVote(poll.id, optionId);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getPercentage = (votes) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  const getWinningOption = () => {
    return poll.options.reduce((max, option) => 
      option.votes > max.votes ? option : max
    );
  };

  const winningOption = getWinningOption();

  return (
    <div className="w-full h-screen flex flex-col relative snap-start snap-always bg-black overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/60 to-transparent p-4 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="ring-2 ring-white/30 w-12 h-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {poll.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white text-base">{poll.author}</h3>
              <p className="text-sm text-white/70">{poll.timeAgo}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-white/20 h-10 w-10 p-0 text-white">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="mt-3">
          <h2 className="text-white font-bold text-lg leading-tight">
            {poll.title}
          </h2>
        </div>
      </div>

      {/* Main content - Full screen grid */}
      <div className="absolute inset-0 grid grid-cols-2 gap-1">
        {poll.options.map((option, optionIndex) => {
          const percentage = getPercentage(option.votes);
          const isWinner = option.id === winningOption.id && poll.totalVotes > 0;
          const isSelected = poll.userVote === option.id;

          return (
            <div
              key={option.id}
              className="relative cursor-pointer group h-full overflow-hidden"
              onClick={() => handleVote(option.id)}
            >
              {/* Background image/color - Full coverage */}
              <div className="absolute inset-0">
                {option.media?.url ? (
                  <img 
                    src={option.media.url} 
                    alt={option.text}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={cn(
                    "w-full h-full",
                    optionIndex === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500" :
                    optionIndex === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                    optionIndex === 2 ? "bg-gradient-to-br from-yellow-500 to-red-500" :
                    "bg-gradient-to-br from-amber-600 to-orange-700"
                  )} />
                )}
              </div>

              {/* Progress overlay - Fills from bottom */}
              {poll.totalVotes > 0 && (
                <div 
                  className={cn(
                    "absolute inset-x-0 bottom-0 transition-all duration-700 ease-out",
                    isSelected 
                      ? "bg-gradient-to-t from-blue-500/80 to-blue-600/60"
                      : isWinner 
                        ? "bg-gradient-to-t from-green-500/80 to-green-600/60"
                        : "bg-gradient-to-t from-black/40 to-transparent"
                  )}
                  style={{ 
                    height: `${percentage}%`,
                  }}
                />
              )}

              {/* Hover/interaction overlay */}
              <div className={cn(
                "absolute inset-0 transition-all duration-300",
                "bg-black/0 group-hover:bg-black/20",
                isSelected && "bg-blue-500/20",
                isWinner && poll.totalVotes > 0 && "bg-green-500/20"
              )} />

              {/* Option letter and percentage - Top right */}
              <div className="absolute top-3 right-3 flex flex-col items-center gap-1 z-20">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg",
                  isSelected 
                    ? "bg-blue-600 text-white" 
                    : isWinner && poll.totalVotes > 0
                      ? "bg-green-600 text-white"
                      : "bg-black/70 text-white"
                )}>
                  {option.id.toUpperCase()}
                </div>
                <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {percentage}%
                </div>
              </div>

              {/* Winner badge */}
              {isWinner && poll.totalVotes > 0 && (
                <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg z-20">
                  <Crown className="w-3 h-3" />
                  Ganador
                </div>
              )}

              {/* Option text - Bottom of each section */}
              <div className="absolute bottom-4 left-3 right-3 z-20">
                <p className={cn(
                  "text-white font-bold text-base leading-tight drop-shadow-lg text-center",
                  "bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm"
                )}>
                  {option.text}
                </p>
              </div>

              {/* Selection ring */}
              {isSelected && (
                <div className="absolute inset-0 ring-4 ring-blue-500 ring-inset z-10"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom info and actions - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 pt-8">
        <div className="mb-3">
          <p className="text-white/90 font-semibold text-sm">
            {formatNumber(poll.totalVotes)} votos
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLike(poll.id);
              }}
              className={cn(
                "flex items-center gap-2 hover:scale-110 transition-transform text-white hover:text-red-400 h-auto p-2",
                poll.userLiked && "text-red-500"
              )}
            >
              <Heart className={cn(
                "w-6 h-6 transition-all",
                poll.userLiked && "fill-current"
              )} />
              <span className="font-bold">{formatNumber(poll.likes)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onComment(poll.id);
              }}
              className="flex items-center gap-2 text-white hover:text-blue-400 hover:scale-110 transition-transform h-auto p-2"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-bold">{formatNumber(poll.comments)}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShare(poll.id);
            }}
            className="flex items-center gap-2 text-white hover:text-green-400 hover:scale-110 transition-transform h-auto p-2"
          >
            <Share className="w-6 h-6" />
            <span className="font-bold">{formatNumber(poll.shares)}</span>
          </Button>
        </div>
      </div>

      {/* Progress indicator - Right side */}
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

      {/* Scroll hints - only on first card */}
      {index === 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20">
          <ChevronDown className="w-6 h-6 text-white/70" />
          <p className="text-white/70 text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
            Desliza para ver más
          </p>
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