import React, { useState } from 'react';
import { Play, Pause, Music } from 'lucide-react';

const MusicPlayer = ({ music, isVisible = true, onTogglePlay, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!music || !isVisible) {
    return null;
  }

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    if (onTogglePlay) {
      onTogglePlay(!isPlaying);
    }
  };

  return (
    <div className={`flex-shrink-0 ${className}`}>
      {/* Reproductor compacto estilo TikTok */}
      <div 
        onClick={handleTogglePlay}
        className="relative cursor-pointer group"
      >
        {/* Container con imagen de fondo */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
          {music.cover ? (
            <img 
              src={music.cover} 
              alt={music.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
          )}
          
          {/* Overlay de reproducción */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isPlaying ? (
              <Pause className="w-3 h-3 text-white fill-white" />
            ) : (
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            )}
          </div>
          
          {/* Indicador de música activa cuando está reproduciéndose */}
          {isPlaying && (
            <div className="absolute -top-0.5 -right-0.5">
              <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
            </div>
          )}
        </div>
        
        {/* Animación de ondas cuando está reproduciéndose */}
        {isPlaying && (
          <div className="absolute -inset-2 opacity-60">
            <div className="w-12 h-12 rounded-full border-2 border-white/30 animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;