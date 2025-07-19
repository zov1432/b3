import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Crown } from 'lucide-react';
import { cn } from '../lib/utils';

const MediaPreview = ({ media, isWinner, isSelected, onClick, percentage, option, totalVotes }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!media) return null;

  if (media.type === 'video') {
    return (
      <div className="relative w-full h-40 rounded-lg overflow-hidden group cursor-pointer" onClick={onClick}>
        <img 
          src={media.thumbnail} 
          alt="Video thumbnail"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Progress Bar Background - Fills vertically from bottom */}
        {totalVotes > 0 && (
          <div 
            className={cn(
              "absolute inset-x-0 bottom-0 transition-all duration-700 ease-out",
              isSelected 
                ? "bg-gradient-to-t from-blue-500/70 to-blue-600/70"
                : isWinner 
                  ? "bg-gradient-to-t from-green-500/70 to-green-600/70"
                  : "bg-gradient-to-t from-gray-400/50 to-gray-500/50"
            )}
            style={{ 
              height: `${percentage}%`,
              transformOrigin: 'bottom'
            }}
          />
        )}

        {/* Play Button */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            isSelected 
              ? "bg-blue-600 text-white"
              : isWinner 
                ? "bg-green-600 text-white"
                : "bg-white/90 text-gray-800 group-hover:bg-white group-hover:scale-110"
          )}>
            <Play className="w-6 h-6 ml-1" />
          </div>
        </div>
        
        {/* Percentage and Letter Overlay */}
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
            {option.id.toUpperCase()}
          </span>
          <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
            {percentage}%
          </span>
        </div>

        {/* Winner Badge */}
        {isWinner && totalVotes > 0 && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Crown className="w-3 h-3" />
            Ganador
          </div>
        )}

        {/* Selection Ring */}
        {isSelected && (
          <div className="absolute inset-0 ring-3 ring-blue-500 rounded-lg"></div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-40 rounded-lg overflow-hidden group cursor-pointer" onClick={onClick}>
      <img 
        src={media.url} 
        alt="Poll option"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Progress Bar Background - Fills vertically from bottom */}
      {totalVotes > 0 && (
        <div 
          className={cn(
            "absolute inset-x-0 bottom-0 transition-all duration-700 ease-out",
            isSelected 
              ? "bg-gradient-to-t from-blue-500/60 to-blue-600/60"
              : isWinner 
                ? "bg-gradient-to-t from-green-500/60 to-green-600/60"
                : "bg-gradient-to-t from-gray-400/40 to-gray-500/40"
          )}
          style={{ 
            height: `${percentage}%`,
            transformOrigin: 'bottom'
          }}
        />
      )}

      {/* Hover Overlay */}
      <div className={cn(
        "absolute inset-0 transition-all duration-300 group-hover:bg-black/10"
      )} />

      {/* Percentage and Letter Overlay */}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
          {option.id.toUpperCase()}
        </span>
        <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
          {percentage}%
        </span>
      </div>

      {/* Winner Badge */}
      {isWinner && totalVotes > 0 && (
        <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
          <Crown className="w-3 h-3" />
          Ganador
        </div>
      )}

      {/* Selection Ring */}
      {isSelected && (
        <div className="absolute inset-0 ring-3 ring-blue-500 rounded-lg"></div>
      )}
    </div>
  );
};

const PollCard = ({ poll, onVote, onLike, onShare, onComment }) => {
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
    <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg overflow-hidden">
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
                  
                  {/* Option Text Only */}
                  <div className="px-1">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(poll.id)}
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(poll.id)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{formatNumber(poll.comments)}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(poll.id)}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 hover:scale-105 transition-transform"
          >
            <Share className="w-5 h-5" />
            <span className="font-medium">{formatNumber(poll.shares)}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollCard;