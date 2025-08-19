import React from 'react';
import TikTokProfileGrid from '../components/TikTokProfileGrid';
import { mockPolls } from '../services/mockData';

const GridDemo = () => {
  // Tomar los primeros 9 polls para mostrar en el grid
  const demoPolls = mockPolls.slice(0, 9);

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
            onPollClick={(poll) => {
              console.log('Clicked poll:', poll.title);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GridDemo;