import React from 'react';

const MusicPlayer = ({ music, isVisible = true, onTogglePlay, className = '' }) => {
  if (!music || !isVisible) {
    return null;
  }

  return (
    <div className={`flex-shrink-0 ${className}`}>
      {/* Solo la miniatura de la música */}
      <div className="relative">
        <img 
          src={music.cover} 
          alt={music.title}
          className="w-12 h-12 rounded-lg object-cover ring-2 ring-white/30 hover:ring-white/50 transition-all duration-300 hover:scale-105"
        />
        {/* Pequeño indicador de música activa */}
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 bg-white rounded-full opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;