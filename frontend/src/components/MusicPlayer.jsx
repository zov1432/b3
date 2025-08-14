import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  RotateCcw
} from 'lucide-react';
import { formatDuration } from '../services/musicLibrary';

const MusicWaveform = ({ waveform, isPlaying, currentTime = 0, duration = 30 }) => {
  const progress = currentTime / duration;
  
  return (
    <div className="flex items-center gap-0.5 h-4 justify-center">
      {waveform.map((height, index) => {
        const barProgress = index / waveform.length;
        const isActive = barProgress <= progress;
        
        return (
          <div
            key={index}
            className={`w-0.5 transition-all duration-100 ${
              isActive && isPlaying 
                ? 'bg-white animate-pulse' 
                : isActive 
                  ? 'bg-white/80'
                  : 'bg-white/40'
            }`}
            style={{
              height: `${height * 12 + 2}px`,
              animationDelay: `${index * 30}ms`
            }}
          />
        );
      })}
    </div>
  );
};

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