import React from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

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

        {/* Options Grid */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {poll.options.map((option) => {
              const percentage = getPercentage(option.votes);
              const isWinner = option.id === winningOption.id && poll.totalVotes > 0;
              const isSelected = poll.userVote === option.id;

              return (
                <div
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  className={cn(
                    "relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 min-h-[80px] flex items-center justify-center",
                    poll.userVote 
                      ? "cursor-default" 
                      : "hover:scale-105 hover:shadow-lg cursor-pointer",
                    isSelected 
                      ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200" 
                      : isWinner && poll.totalVotes > 0
                        ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                  )}
                >
                  {/* Progress Bar Background */}
                  {poll.totalVotes > 0 && (
                    <div 
                      className={cn(
                        "absolute inset-0 transition-all duration-700 ease-out",
                        isSelected 
                          ? "bg-gradient-to-r from-blue-200/40 to-blue-300/40"
                          : isWinner 
                            ? "bg-gradient-to-r from-green-200/40 to-green-300/40"
                            : "bg-gradient-to-r from-gray-200/30 to-gray-300/30"
                      )}
                      style={{ 
                        width: `${percentage}%`,
                        transformOrigin: 'left'
                      }}
                    />
                  )}

                  <div className="relative z-10 text-center px-3 py-4 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-lg font-bold",
                        isSelected 
                          ? "text-blue-700"
                          : isWinner && poll.totalVotes > 0
                            ? "text-green-700"
                            : "text-gray-700"
                      )}>
                        {option.id.toUpperCase()}
                      </span>
                      <span className={cn(
                        "text-sm font-semibold px-2 py-1 rounded-full",
                        isSelected 
                          ? "bg-blue-600 text-white"
                          : isWinner && poll.totalVotes > 0
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 text-white"
                      )}>
                        {percentage}%
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm font-medium leading-tight",
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