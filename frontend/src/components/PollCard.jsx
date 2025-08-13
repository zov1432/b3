import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Crown, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAddiction } from '../contexts/AddictionContext';
import { SocialProofBadge } from './AddictionUI';
import { motion } from 'framer-motion';

const MediaPreview = ({ media, isWinner, isSelected, onClick, percentage, option, totalVotes, fullScreen = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { trackAction } = useAddiction();

  const handleClick = async () => {
    // Track view action for addiction system
    await trackAction('view', {
      poll_id: option.pollId,
      option_id: option.id,
      timestamp: new Date().toISOString()
    });
    
    onClick && onClick();
  };

  if (!media) return null;

  const heightClass = fullScreen ? "h-full min-h-48" : "h-40";

  if (media.type === 'video') {
    return (
      <motion.div 
        className={cn("relative w-full rounded-lg overflow-hidden group cursor-pointer", heightClass)} 
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <img 
          src={media.thumbnail} 
          alt="Video thumbnail"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Progress Bar Background - Fills vertically from bottom */}
        {totalVotes > 0 && (
          <motion.div 
            className={cn(
              "absolute inset-x-0 bottom-0 transition-all duration-700 ease-out",
              isSelected 
                ? "bg-gradient-to-t from-blue-500/70 to-blue-600/70"
                : isWinner 
                  ? "bg-gradient-to-t from-green-500/70 to-green-600/70"
                  : "bg-gradient-to-t from-gray-400/50 to-gray-500/50"
            )}
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ 
              transformOrigin: 'bottom'
            }}
          />
        )}

        {/* Play Button with pulse effect */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
          <motion.div 
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              isSelected 
                ? "bg-blue-600 text-white"
                : isWinner 
                  ? "bg-green-600 text-white"
                  : "bg-white/90 text-gray-800 group-hover:bg-white group-hover:scale-110"
            )}
            whileHover={{ scale: 1.1 }}
            animate={isSelected ? { 
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                "0 0 0 10px rgba(59, 130, 246, 0)",
                "0 0 0 0 rgba(59, 130, 246, 0)"
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Play className="w-6 h-6 ml-1" />
          </motion.div>
        </div>
        
        {/* User Avatar Overlay */}
        <div className="absolute top-2 right-2 flex flex-col items-center gap-1">
          <Avatar className={cn(
            "w-8 h-8 ring-2 transition-all",
            isSelected 
              ? "ring-blue-400"
              : isWinner
                ? "ring-green-400"
                : "ring-white/50"
          )}>
            <AvatarImage src={option.user?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xs">
              {option.user?.displayName?.charAt(0) || option.id.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {option.user?.verified && (
            <CheckCircle className="w-3 h-3 text-blue-500 fill-current -mt-1" />
          )}
        </div>

        {/* Winner Badge with animation */}
        {isWinner && totalVotes > 0 && (
          <motion.div 
            className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Crown className="w-3 h-3" />
            Ganador
          </motion.div>
        )}

        {/* Selection Ring with pulse */}
        {isSelected && (
          <motion.div 
            className="absolute inset-0 ring-3 ring-blue-500 rounded-lg"
            animate={{
              ringWidth: ["3px", "5px", "3px"],
              ringOpacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={cn("relative w-full rounded-lg overflow-hidden group cursor-pointer", heightClass)} 
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img 
        src={media.url} 
        alt="Poll option"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Progress Bar Background - Fills vertically from bottom */}
      {totalVotes > 0 && (
        <motion.div 
          className={cn(
            "absolute inset-x-0 bottom-0 transition-all duration-700 ease-out",
            isSelected 
              ? "bg-gradient-to-t from-blue-500/60 to-blue-600/60"
              : isWinner 
                ? "bg-gradient-to-t from-green-500/60 to-green-600/60"
                : "bg-gradient-to-t from-gray-400/40 to-gray-500/40"
          )}
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      )}

      {/* Hover Overlay */}
      <div className={cn(
        "absolute inset-0 transition-all duration-300 group-hover:bg-black/10"
      )} />

      {/* User Avatar and Percentage Overlay */}
      <div className="absolute top-2 right-2 flex flex-col items-center gap-1">
        <Avatar className={cn(
          "w-8 h-8 ring-2 transition-all",
          isSelected 
            ? "ring-blue-400"
            : isWinner
              ? "ring-green-400"
              : "ring-white/50"
        )}>
          <AvatarImage src={option.user?.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xs">
            {option.user?.displayName?.charAt(0) || option.id.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {option.user?.verified && (
          <CheckCircle className="w-3 h-3 text-blue-500 fill-current -mt-1" />
        )}
        <motion.span 
          className="bg-black/70 text-white px-2 py-0.5 rounded-full text-xs font-bold"
          animate={{ scale: isSelected ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
        >
          {percentage}%
        </motion.span>
      </div>

      {/* Winner Badge */}
      {isWinner && totalVotes > 0 && (
        <motion.div 
          className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Crown className="w-3 h-3" />
          Ganador
        </motion.div>
      )}

      {/* Selection Ring */}
      {isSelected && (
        <motion.div 
          className="absolute inset-0 ring-3 ring-blue-500 rounded-lg"
          animate={{
            ringOpacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

const PollCard = ({ poll, onVote, onLike, onShare, onComment, fullScreen = false }) => {
  const { trackAction, getSocialProof } = useAddiction();
  const [socialProof, setSocialProof] = useState(null);

  useEffect(() => {
    // Load social proof data
    getSocialProof(poll.id).then(proof => {
      setSocialProof(proof);
    });
  }, [poll.id, getSocialProof]);

  const handleVote = async (optionId) => {
    if (!poll.userVote) {
      onVote(poll.id, optionId);
      
      // Track vote action for addiction system
      await trackAction('vote', {
        poll_id: poll.id,
        option_id: optionId,
        timestamp: new Date().toISOString(),
        votes_in_last_minute: 1 // This would be tracked properly in real implementation
      });
    }
  };

  const handleLike = async () => {
    onLike(poll.id);
    
    // Track like action
    await trackAction('like', {
      poll_id: poll.id,
      timestamp: new Date().toISOString()
    });
  };

  const handleShare = async () => {
    onShare(poll.id);
    
    // Track share action
    await trackAction('share', {
      poll_id: poll.id,
      timestamp: new Date().toISOString()
    });
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

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full h-full max-h-[90vh] group bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl overflow-hidden flex flex-col rounded-xl">
          <CardContent className="p-0 flex flex-col h-full">
            {/* Header - Compact for full screen */}
            <div className="flex items-center justify-between p-4 pb-3 flex-shrink-0 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Avatar className="ring-2 ring-blue-500/20 w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                    {poll.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{poll.author}</h3>
                  <p className="text-xs text-gray-500">{poll.timeAgo}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100 h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Social Proof Badge */}
            {socialProof && (
              <div className="px-4 pb-2">
                <SocialProofBadge 
                  pollId={poll.id}
                  socialProof={socialProof}
                  onLoadProof={getSocialProof}
                />
              </div>
            )}

            {/* Poll Title - Compact */}
            <div className="px-4 pb-3 flex-shrink-0 bg-white/90 backdrop-blur-sm">
              <h2 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">
                {poll.title}
              </h2>
            </div>

            {/* Media Grid - Takes most space */}
            <div className="px-4 pb-4 flex-1 flex flex-col justify-center min-h-0">
              <div className="grid grid-cols-2 gap-3 h-full max-h-80">
                {poll.options.map((option) => {
                  const percentage = getPercentage(option.votes);
                  const isWinner = option.id === winningOption.id && poll.totalVotes > 0;
                  const isSelected = poll.userVote === option.id;

                  return (
                    <div key={option.id} className="space-y-2 flex flex-col h-full min-h-0">
                      {/* Media Preview - Responsive height */}
                      <div className="relative flex-1 min-h-[120px]">
                        <MediaPreview 
                          media={option.media}
                          isWinner={isWinner}
                          isSelected={isSelected}
                          onClick={() => handleVote(option.id)}
                          percentage={percentage}
                          option={option}
                          totalVotes={poll.totalVotes}
                          fullScreen={true}
                        />
                      </div>
                      
                      {/* Option Text with User Info */}
                      <div className="px-1 flex-shrink-0">
                        <div className="text-center">
                          {option.user && (
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <p className="text-xs font-semibold text-gray-700">
                                {option.user.displayName}
                              </p>
                              {option.user.verified && (
                                <CheckCircle className="w-3 h-3 text-blue-500 fill-current" />
                              )}
                            </div>
                          )}
                          <p className={cn(
                            "text-xs font-medium leading-tight text-center line-clamp-2",
                            isSelected 
                              ? "text-blue-800"
                              : isWinner && poll.totalVotes > 0
                                ? "text-green-800"
                                : "text-gray-800"
                          )}>
                            {option.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vote Count - Compact */}
            <div className="px-4 pb-2 flex-shrink-0 bg-white/90 backdrop-blur-sm">
              <p className="text-xs text-gray-600 font-medium">
                {formatNumber(poll.totalVotes)} votos
              </p>
            </div>

            {/* Social Actions - Compact and sticky */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-sm border-t border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-4">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={cn(
                      "flex items-center gap-2 hover:scale-105 transition-transform h-8 px-2",
                      poll.userLiked 
                        ? "text-red-600 hover:text-red-700" 
                        : "text-gray-600 hover:text-red-600"
                    )}
                  >
                    <Heart className={cn(
                      "w-4 h-4 transition-all",
                      poll.userLiked && "fill-current"
                    )} />
                    <span className="font-medium text-xs">{formatNumber(poll.likes)}</span>
                  </Button>
                </motion.div>
                
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onComment(poll.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:scale-105 transition-transform h-8 px-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium text-xs">{formatNumber(poll.comments)}</span>
                  </Button>
                </motion.div>
              </div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 hover:scale-105 transition-transform h-8 px-2"
                >
                  <Share className="w-4 h-4" />
                  <span className="font-medium text-xs">{formatNumber(poll.shares)}</span>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-2xl transition-all duration-500 transform bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="ring-2 ring-blue-500/20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {poll.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{poll.author}</h3>
                <p className="text-sm text-gray-500">{poll.timeAgo}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Social Proof Badge */}
          {socialProof && (
            <div className="px-4 pb-3">
              <SocialProofBadge 
                pollId={poll.id}
                socialProof={socialProof}
                onLoadProof={getSocialProof}
              />
            </div>
          )}

          {/* Poll Title */}
          <div className="px-4 pb-4">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {poll.title}
            </h2>
          </div>

          {/* Media Grid - Similar to second reference image */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              {poll.options.map((option) => {
                const percentage = getPercentage(option.votes);
                const isWinner = option.id === winningOption.id && poll.totalVotes > 0;
                const isSelected = poll.userVote === option.id;

                return (
                  <div key={option.id} className="space-y-2">
                    {/* Media Preview with Overlay Progress */}
                    <MediaPreview 
                      media={option.media}
                      isWinner={isWinner}
                      isSelected={isSelected}
                      onClick={() => handleVote(option.id)}
                      percentage={percentage}
                      option={option}
                      totalVotes={poll.totalVotes}
                    />
                    
                    {/* Option Text with User Info */}
                    <div className="px-1">
                      <div className="text-center">
                        {option.user && (
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <p className="text-sm font-semibold text-gray-700">
                              {option.user.displayName}
                            </p>
                            {option.user.verified && (
                              <CheckCircle className="w-3 h-3 text-blue-500 fill-current" />
                            )}
                          </div>
                        )}
                        <p className={cn(
                          "text-sm font-medium leading-tight text-center",
                          isSelected 
                            ? "text-blue-800"
                            : isWinner && poll.totalVotes > 0
                              ? "text-green-800"
                              : "text-gray-800"
                        )}>
                          {option.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vote Count */}
          <div className="px-4 pb-3">
            <p className="text-sm text-gray-600 font-medium">
              {formatNumber(poll.totalVotes)} votos
            </p>
          </div>

          {/* Social Actions */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    "flex items-center gap-2 hover:scale-105 transition-transform",
                    poll.userLiked 
                      ? "text-red-600 hover:text-red-700" 
                      : "text-gray-600 hover:text-red-600"
                  )}
                >
                  <Heart className={cn(
                    "w-5 h-5 transition-all",
                    poll.userLiked && "fill-current"
                  )} />
                  <span className="font-medium">{formatNumber(poll.likes)}</span>
                </Button>
              </motion.div>
              
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onComment(poll.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:scale-105 transition-transform"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{formatNumber(poll.comments)}</span>
                </Button>
              </motion.div>
            </div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 hover:scale-105 transition-transform"
              >
                <Share className="w-5 h-5" />
                <span className="font-medium">{formatNumber(poll.shares)}</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PollCard;