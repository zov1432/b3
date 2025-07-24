import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  Heart, MessageCircle, Share, Play, Volume2, VolumeX,
  Crown, CheckCircle, Flame, Users, TrendingUp
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

// Perfect TikTok-style Voting Card matching the reference image
const TikTokVotingCard = ({ 
  poll, 
  onVote, 
  onLike, 
  onShare, 
  onComment,
  className = ""
}) => {
  const [selectedOption, setSelectedOption] = useState(poll.userVote || null);
  const [showResults, setShowResults] = useState(poll.userVote !== null);
  const [explosionEffect, setExplosionEffect] = useState(false);
  
  const cardRef = useRef(null);
  
  const handleVote = async (optionId) => {
    if (selectedOption) return; // Already voted
    
    setExplosionEffect(true);
    setSelectedOption(optionId);
    
    setTimeout(() => {
      setShowResults(true);
      onVote?.(poll.id, optionId);
      setExplosionEffect(false);
    }, 800);
  };
  
  const getPercentage = (option) => {
    if (!showResults || poll.totalVotes === 0) return 0;
    return Math.round((option.votes / poll.totalVotes) * 100);
  };
  
  const getWinningOption = () => {
    if (!showResults) return null;
    return poll.options.reduce((max, option) => 
      option.votes > max.votes ? option : max, poll.options[0]
    );
  };
  
  const winningOption = getWinningOption();
  
  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative w-full max-w-sm mx-auto bg-black rounded-3xl overflow-hidden",
        "aspect-[9/16]", // TikTok aspect ratio
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Explosion Effect */}
      <AnimatePresence>
        {explosionEffect && (
          <motion.div className="absolute inset-0 pointer-events-none z-50">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                style={{
                  left: '50%',
                  top: '50%'
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 0.8, 0],
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Author Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-white/30">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">
              {poll.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-white text-sm">{poll.author}</h3>
            <p className="text-white/70 text-xs">{poll.timeAgo}</p>
          </div>
        </div>
        
        {/* Music indicator */}
        {poll.music && (
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-xs">♪ {poll.music.title}</span>
          </div>
        )}
      </div>
      
      {/* Main 2x2 Grid - Exactly like the reference */}
      <div className="absolute inset-0 pt-20 pb-32">
        <div className="relative w-full h-full">
          {/* Question in the center */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <motion.div
              className="bg-black/80 backdrop-blur-lg rounded-2xl px-6 py-4 border-2 border-white/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <h2 className="text-white font-black text-lg text-center leading-tight">
                {poll.title}
              </h2>
            </motion.div>
          </div>
          
          {/* 2x2 Options Grid */}
          <div className="grid grid-cols-2 gap-1 w-full h-full">
            {poll.options.slice(0, 4).map((option, index) => {
              const percentage = getPercentage(option);
              const isWinner = winningOption?.id === option.id;
              const isSelected = selectedOption === option.id;
              const optionNumber = index + 1;
              
              return (
                <motion.div
                  key={option.id}
                  className="relative cursor-pointer group overflow-hidden"
                  onClick={() => handleVote(option.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Media Background */}
                  <div className="absolute inset-0">
                    {option.media?.type === 'video' ? (
                      <>
                        <img 
                          src={option.media.thumbnail} 
                          alt={`Option ${optionNumber}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                            <Play className="w-4 h-4 text-black ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <img 
                        src={option.media?.url} 
                        alt={`Option ${optionNumber}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Results Progress Overlay */}
                  {showResults && (
                    <motion.div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-t",
                        isSelected 
                          ? "from-blue-500/70 to-blue-600/30"
                          : isWinner
                            ? "from-green-500/70 to-green-600/30"
                            : "from-gray-500/50 to-gray-600/20"
                      )}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: percentage / 100 }}
                      transition={{ duration: 1 }}
                    />
                  )}
                  
                  {/* Option Number - Prominent like in reference */}
                  <div className="absolute top-3 left-3 z-10">
                    <motion.div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-black text-lg",
                        "border-2 shadow-lg",
                        isSelected 
                          ? "bg-blue-500 text-white border-blue-300"
                          : isWinner && showResults
                            ? "bg-green-500 text-white border-green-300"
                            : "bg-white/90 text-black border-white/50"
                      )}
                      animate={isSelected ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      } : {}}
                      transition={{ duration: 0.8 }}
                    >
                      {optionNumber}
                    </motion.div>
                  </div>
                  
                  {/* Winner Crown */}
                  {isWinner && showResults && (
                    <motion.div
                      className="absolute top-3 right-3 z-10"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Percentage Display */}
                  {showResults && (
                    <motion.div
                      className="absolute bottom-3 right-3 z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="bg-black/80 text-white px-2 py-1 rounded-full text-sm font-bold">
                        {percentage}%
                      </div>
                    </motion.div>
                  )}
                  
                  {/* User Avatar for each option */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <Avatar className="w-6 h-6 ring-1 ring-white/50">
                      <AvatarImage src={option.user?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xs">
                        {option.user?.displayName?.charAt(0) || optionNumber}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Selection Ring */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 ring-4 ring-blue-400"
                      animate={{
                        ringOpacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Bottom Actions Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent p-4">
        {/* Vote Count */}
        {showResults && (
          <div className="mb-3 text-center">
            <span className="text-white font-bold text-sm">
              {poll.totalVotes.toLocaleString()} votos totales
            </span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-around">
          <motion.button
            className={cn(
              "flex flex-col items-center gap-1 text-white",
              poll.userLiked && "text-red-500"
            )}
            onClick={() => onLike?.(poll.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Heart className={cn("w-6 h-6", poll.userLiked && "fill-current")} />
            </div>
            <span className="text-xs font-semibold">{poll.likes > 999 ? `${(poll.likes/1000).toFixed(1)}K` : poll.likes}</span>
          </motion.button>
          
          <motion.button
            className="flex flex-col items-center gap-1 text-white"
            onClick={() => onComment?.(poll.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold">{poll.comments > 999 ? `${(poll.comments/1000).toFixed(1)}K` : poll.comments}</span>
          </motion.button>
          
          <motion.button
            className="flex flex-col items-center gap-1 text-white"
            onClick={() => onShare?.(poll.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Share className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold">{poll.shares > 999 ? `${(poll.shares/1000).toFixed(1)}K` : poll.shares}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TikTokVotingCard;