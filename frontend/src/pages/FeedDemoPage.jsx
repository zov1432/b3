import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  Heart, MessageCircle, Send, Bookmark, Play, Pause,
  Volume2, VolumeX, MoreHorizontal, CheckCircle,
  Users, Eye, ThumbsUp, Crown, Star, Flame
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockPolls } from '../services/mockData';

// Componente: Video Player para publicaciones de video
const VideoPlayer = ({ video, isActive = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (isActive && !isPlaying) {
      // Auto-play cuando es visible
      setTimeout(() => setIsPlaying(true), 500);
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
        {/* Simulated Video Thumbnail */}
        <img 
          src={video.thumbnail} 
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
        
        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!isPlaying && (
            <motion.button
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play className="w-8 h-8 text-white ml-2" />
            </motion.button>
          )}
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: video.duration, ease: 'linear' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Video Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>
        
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Video Duration */}
      <div className="absolute bottom-4 right-4">
        <Badge className="bg-black/50 text-white border-white/30 text-xs">
          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
        </Badge>
      </div>
    </div>
  );
};

// Componente: Feed Card para mostrar cada publicación
const FeedCard = ({ poll, index, isActive = false }) => {
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (poll.options.length > 1) {
      const interval = setInterval(() => {
        setCurrentOptionIndex(prev => (prev + 1) % poll.options.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [poll.options.length]);

  const handleVote = (optionId) => {
    setUserVote(optionId);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const currentOption = poll.options[currentOptionIndex];
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Content */}
      <div className="absolute inset-0">
        {currentOption.media.type === 'video' ? (
          <VideoPlayer video={currentOption.media} isActive={isActive} />
        ) : (
          <div className="w-full h-full">
            <img 
              src={currentOption.media.url}
              alt={currentOption.text}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>
        )}
      </div>

      {/* Top Section - User Info & Music */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-white/50">
            <AvatarImage src={currentOption.user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">
              {currentOption.user.displayName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">@{currentOption.user.username}</span>
              {currentOption.user.verified && (
                <CheckCircle className="w-5 h-5 text-blue-400 fill-current" />
              )}
            </div>
            <span className="text-white/70 text-sm">{poll.timeAgo}</span>
          </div>
        </div>

        {/* Music Info */}
        {poll.music && (
          <motion.div
            className="flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-full"
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">♪</span>
            </div>
            <span className="text-white text-sm font-medium">{poll.music.title}</span>
          </motion.div>
        )}
      </div>

      {/* Center - Poll Title */}
      <div className="absolute top-1/3 left-6 right-6 z-10">
        <h1 className="text-white text-2xl md:text-4xl font-bold text-center mb-4 drop-shadow-lg">
          {poll.title}
        </h1>
        
        {/* Current Option Info */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full mb-4">
            <span className="text-white font-bold">{currentOption.text}</span>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
              {Math.round((currentOption.votes / totalVotes) * 100)}%
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom Section - Interactive Elements */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        {/* Voting Options Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {poll.options.map((option, idx) => (
            <motion.button
              key={option.id}
              className={cn(
                "p-3 rounded-xl border-2 text-white font-bold text-sm transition-all",
                idx === currentOptionIndex
                  ? "bg-white/20 border-white/50 backdrop-blur-sm"
                  : "bg-black/30 border-white/20",
                userVote === option.id
                  ? "bg-blue-500/50 border-blue-400"
                  : ""
              )}
              onClick={() => handleVote(option.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-between">
                <span>{option.text}</span>
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  {option.votes}
                </Badge>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                liked ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white"
              )}
              onClick={handleLike}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={cn("w-5 h-5", liked ? "fill-current" : "")} />
              <span className="font-bold">{(poll.likes / 1000).toFixed(0)}K</span>
            </motion.button>

            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-bold">{(poll.comments / 1000).toFixed(0)}K</span>
            </motion.button>

            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Send className="w-5 h-5" />
              <span className="font-bold">{(poll.shares / 1000).toFixed(0)}K</span>
            </motion.button>
          </div>

          <motion.button
            className={cn(
              "p-2 rounded-full transition-all",
              saved ? "bg-yellow-500/20 text-yellow-400" : "bg-white/10 text-white"
            )}
            onClick={handleSave}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark className={cn("w-5 h-5", saved ? "fill-current" : "")} />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-4 text-white/70 text-sm">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{totalVotes.toLocaleString()} votos</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{currentOption.user.followers} seguidores</span>
          </div>
        </div>
      </div>

      {/* Navigation Indicator */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        <div className="flex flex-col gap-2">
          {poll.options.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentOptionIndex ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente principal: Feed Demo Page
const FeedDemoPage = () => {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [posts] = useState(mockPolls.slice(0, 6)); // Solo primeras 6 publicaciones nuevas

  const handleNext = () => {
    setCurrentPostIndex((prev) => (prev + 1) % posts.length);
  };

  const handlePrev = () => {
    setCurrentPostIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Header Demo Info */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-bold">FEED DEMO - Multimedia</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span>{currentPostIndex + 1} de {posts.length}</span>
            <Badge className="bg-white/10 text-white border-white/30">
              {posts[currentPostIndex]?.options[0]?.media.type === 'video' ? '📹' : '📷'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 px-6 py-3 bg-black/60 backdrop-blur-sm rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span>↑↓</span>
            <span>Navegar</span>
          </div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span>Click</span>
            <span>Interactuar</span>
          </div>
        </div>
      </div>

      {/* Posts Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPostIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <FeedCard 
            poll={posts[currentPostIndex]} 
            index={currentPostIndex}
            isActive={true}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col gap-4">
          <motion.button
            className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20"
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ↑
          </motion.button>
          
          <motion.button
            className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20"
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ↓
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FeedDemoPage;