import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Music, 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Check,
  Sparkles,
  Clock
} from 'lucide-react';
import { 
  musicLibrary, 
  musicCategories, 
  getMusicByCategory, 
  searchMusic, 
  getRecommendedMusic,
  formatDuration 
} from '../services/musicLibrary';

const MusicWaveform = ({ waveform, isPlaying, duration = 30 }) => {
  return (
    <div className="flex items-center gap-0.5 h-6 justify-center">
      {waveform.map((height, index) => (
        <div
          key={index}
          className={`w-0.5 bg-current transition-all duration-75 ${
            isPlaying ? 'animate-pulse' : 'opacity-70'
          }`}
          style={{
            height: `${height * 20 + 4}px`,
            animationDelay: `${index * 50}ms`
          }}
        />
      ))}
    </div>
  );
};

// Simplified TikTok/Instagram style music card
const SimpleMusicCard = ({ music, isSelected, isPlaying, onSelect, onPlay }) => {
  return (
    <div 
      className={`
        flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50
        ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
      `}
      onClick={() => onSelect(music)}
    >
      {/* Cover with play button */}
      <div 
        className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onPlay(music);
        }}
      >
        <img 
          src={music.cover} 
          alt={music.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/90 flex items-center justify-center transition-all ${isPlaying ? 'scale-110' : ''}`}>
            {isPlaying ? (
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full animate-pulse" />
            ) : (
              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black ml-0.5" />
            )}
          </div>
        </div>
      </div>

      {/* Music info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
          {music.title}
        </h4>
        <p className="text-xs text-gray-500 truncate">
          {music.artist}
        </p>
      </div>

      {/* Simple waveform indicator - Hidden on very small screens */}
      <div className="hidden sm:flex items-center gap-0.5">
        {music.waveform.slice(0, 4).map((height, index) => (
          <div
            key={index}
            className={`w-1 bg-gray-400 rounded-full transition-all duration-75 ${
              isPlaying ? 'animate-pulse' : ''
            }`}
            style={{
              height: `${height * 12 + 4}px`,
              animationDelay: `${index * 100}ms`
            }}
          />
        ))}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </div>
      )}
    </div>
  );
};

const MusicSelector = ({ onSelectMusic, selectedMusic, pollTitle = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [currentMusic, setCurrentMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Obtener música filtrada
  const getFilteredMusic = () => {
    if (searchQuery.trim()) {
      return searchMusic(searchQuery);
    }
    return getMusicByCategory(activeCategory);
  };

  const filteredMusic = getFilteredMusic();

  const handlePlay = (music) => {
    // Pausar música anterior si hay una reproduciéndose
    if (isPlaying && currentMusic?.id !== music.id) {
      setIsPlaying(false);
    }
    
    setCurrentMusic(music);
    setIsPlaying(true);
    
    // Simular reproducción por 3 segundos
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentMusic(null);
    }, 3000);
  };

  const handleSelectMusic = (music) => {
    onSelectMusic(music);
  };

  return (
    <div className="space-y-3 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h3 className="font-bold text-lg">Agregar música</h3>
        {selectedMusic && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectMusic(null)}
            className="text-gray-500 hover:text-red-500 text-xs"
          >
            Quitar
          </Button>
        )}
      </div>

      {/* Quick search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar música..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-50 border-0 rounded-full"
        />
      </div>

      {/* Quick categories - Horizontal scroll like TikTok */}
      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['Trending', 'Pop', 'Hip-Hop', 'Electronic', 'Rock'].map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category === 'Trending' ? 'Todas' : category)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium ${
                activeCategory === category || (category === 'Trending' && activeCategory === 'Todas')
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-0'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Music list - Simple vertical list like Instagram */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {filteredMusic.length > 0 ? (
          filteredMusic.map((music) => (
            <SimpleMusicCard
              key={music.id}
              music={music}
              isSelected={selectedMusic?.id === music.id}
              isPlaying={currentMusic?.id === music.id && isPlaying}
              onSelect={handleSelectMusic}
              onPlay={handlePlay}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay música disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicSelector;