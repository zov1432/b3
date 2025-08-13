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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef(null);

  // Reset when music changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [music?.id]);

  const handlePlayPause = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    if (newIsPlaying) {
      // Simular progreso de tiempo
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= music.duration) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
            return 0; // Reiniciar
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    onTogglePlay?.(newIsPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!music || !isVisible) {
    return null;
  }

  return (
    <div className={`
      flex items-center gap-2 hover:scale-110 transition-all duration-200 
      h-auto p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/20
      ${className}
    `}>
      {/* Music cover - Same size as button icons */}
      <div className="relative flex-shrink-0">
        <img 
          src={music.cover} 
          alt={music.title}
          className={`w-7 h-7 rounded-md object-cover ring-1 ring-white/30 transition-transform duration-300 ${
            isPlaying ? 'scale-110 ring-white/50' : ''
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-1 h-1 bg-white rounded-full ${
            isPlaying ? 'animate-pulse' : 'opacity-70'
          }`} />
        </div>
      </div>
      
      {/* Music info - Compact */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-base truncate">
          {music.title}
        </p>
        <div className="flex items-center gap-1">
          <Music className="w-3 h-3 text-white/70" />
          <span className="text-white/70 text-xs truncate">{music.artist}</span>
        </div>
      </div>
      
      {/* Play button - Same style as social buttons */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePlayPause}
        className="h-7 w-7 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>

      {/* Mini waveform progress */}
      <div className="flex items-center gap-0.5 h-7 justify-center flex-shrink-0">
        {music.waveform && music.waveform.slice(0, 8).map((height, index) => {
          const progress = currentTime / music.duration;
          const barProgress = index / 8;
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
                height: `${height * 8 + 4}px`,
                animationDelay: `${index * 50}ms`
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MusicPlayer;