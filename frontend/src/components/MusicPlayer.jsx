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

  const handleRestart = () => {
    setCurrentTime(0);
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= music.duration) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
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
      bg-black/70 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/20
      ${className}
    `}>
      {/* Header with music info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <img 
            src={music.cover} 
            alt={music.title}
            className={`w-10 h-10 rounded-lg object-cover ring-2 ring-white/30 transition-transform duration-300 ${
              isPlaying ? 'scale-110 ring-white/50' : ''
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-2 h-2 bg-white rounded-full ${
              isPlaying ? 'animate-pulse' : 'opacity-70'
            }`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {music.title}
          </p>
          <p className="text-white/70 text-xs truncate">
            {music.artist}
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMuteToggle}
            className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestart}
            className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Waveform with progress */}
      <div className="mb-3">
        <MusicWaveform 
          waveform={music.waveform} 
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={music.duration}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePlayPause}
          className="h-10 w-10 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>

        <div className="text-center flex-1 mx-3">
          <div className="text-white/90 text-xs">
            {formatDuration(currentTime)} / {formatDuration(music.duration)}
          </div>
          <div className="w-full bg-white/20 rounded-full h-1 mt-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-1000"
              style={{ width: `${(currentTime / music.duration) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 text-white/70 text-xs">
          <Music className="w-3 h-3" />
          <span>{music.category}</span>
        </div>
      </div>

      {/* Original music indicator */}
      {music.isOriginal && (
        <div className="mt-2 text-center">
          <span className="bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
            Música Original
          </span>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;