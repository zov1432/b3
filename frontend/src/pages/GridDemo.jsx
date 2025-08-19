import React, { useState } from 'react';
import TikTokProfileGrid from '../components/TikTokProfileGrid';
import PollModal from '../components/PollModal';
import { mockPolls } from '../services/mockData';

const GridDemo = () => {
  // Tomar los primeros 9 polls para mostrar en el grid
  const demoPolls = mockPolls.slice(0, 9);
  const [showPollModal, setShowPollModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);

  const handlePollClick = (poll) => {
    setSelectedPoll(poll);
    setShowPollModal(true);
  };

  const handleVote = (pollId, optionId) => {
    console.log('Vote:', pollId, optionId);
  };

  const handleLike = (pollId) => {
    console.log('Like:', pollId);
  };

  const handleShare = (pollId) => {
    console.log('Share:', pollId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          TikTok Profile Grid Demo
        </h1>
        
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Votaciones</h2>
          <TikTokProfileGrid 
            polls={demoPolls}
            onPollClick={handlePollClick}
          />
        </div>
      </div>

      {/* Poll Modal */}
      <PollModal
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
        poll={selectedPoll}
        onVote={handleVote}
        onLike={handleLike}
        onShare={handleShare}
      />
    </div>
  );
};

export default GridDemo;