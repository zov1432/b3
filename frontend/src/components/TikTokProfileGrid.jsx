import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

const TikTokProfileGrid = ({ polls, onPollClick }) => {
  // Function to format vote count
  const formatViewCount = (votes) => {
    if (votes >= 1000000) {
      return `${(votes / 1000000).toFixed(1)}M`;
    } else if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}K`;
    }
    return votes.toString();
  };

  // Function to get vote count
  const getVoteCount = (poll) => {
    return poll.totalVotes || 0;
  };

  // Function to get cover image (like in the feed)
  const getCoverImage = (poll) => {
    // Use the first option's media thumbnail, or fallback to a default
    if (poll.options && poll.options.length > 0) {
      for (let option of poll.options) {
        if (option.media && option.media.thumbnail) {
          return option.media.thumbnail;
        }
        if (option.media && option.media.url) {
          return option.media.url;
        }
      }
    }
    
    // Fallback to a default image based on poll content
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop&crop=center';
  };

  return (
    <div className="grid grid-cols-3 gap-1">
      {polls.map((poll, index) => {
        const coverImage = getCoverImage(poll);
        const voteCount = getVoteCount(poll);

        return (
          <motion.div
            key={poll.id}
            className="relative aspect-[3/4] bg-black overflow-hidden cursor-pointer group"
            onClick={() => onPollClick && onPollClick(poll)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {/* Cover Image */}
            <img
              src={coverImage}
              alt={poll.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/30" />

            {/* MAKE YOUR CHOICE text overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white font-bold text-lg tracking-wider drop-shadow-lg text-center px-4">
                <div className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent font-extrabold text-xl mb-1">
                  MAKE YOUR
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent font-extrabold text-xl">
                  CHOICE
                </div>
              </div>
            </div>

            {/* Play Button (on hover) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                <Play className="w-6 h-6 text-white ml-1" />
              </motion.div>
            </div>

            {/* Vote Count with Play icon */}
            <div className="absolute bottom-2 left-2">
              <div className="flex items-center gap-1 text-white text-sm font-bold drop-shadow-lg">
                <Play className="w-3 h-3 fill-white" />
                <span className="text-shadow-lg">{formatViewCount(voteCount)}</span>
              </div>
            </div>

            {/* Gradient overlay for better text readability */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default TikTokProfileGrid;