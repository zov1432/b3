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

const MusicCard = ({ music, isSelected, isPlaying, onSelect, onPlay, onPause }) => {
  return (
    <div 
      className={`
        relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
      `}
      onClick={() => onSelect(music)}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
          <Check className="w-3 h-3" />
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Cover */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
          <img 
            src={music.cover} 
            alt={music.title}
            className="w-full h-full object-cover"
          />
          {/* Play/Pause button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              isPlaying ? onPause() : onPlay(music);
            }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate">
            {music.title}
          </h4>
          <p className="text-xs text-gray-600 truncate">
            {music.artist}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {music.category}
            </Badge>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(music.duration)}
            </span>
            {music.isOriginal && (
              <Badge variant="default" className="text-xs px-2 py-0 bg-green-600">
                Original
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Waveform */}
      <div className="mt-2 text-blue-500">
        <MusicWaveform 
          waveform={music.waveform} 
          isPlaying={isPlaying}
          duration={music.duration}
        />
      </div>
    </div>
  );
};

const MusicSelector = ({ onSelectMusic, selectedMusic, pollTitle = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [currentMusic, setCurrentMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRecommended, setShowRecommended] = useState(true);
  const audioRef = useRef(null);

  // Obtener música filtrada
  const getFilteredMusic = () => {
    if (searchQuery.trim()) {
      return searchMusic(searchQuery);
    }
    return getMusicByCategory(activeCategory);
  };

  const filteredMusic = getFilteredMusic();
  const recommendedMusic = getRecommendedMusic(pollTitle);

  const handlePlay = (music) => {
    // En una implementación real, aquí cargarías y reproducirías el archivo de audio
    setCurrentMusic(music);
    setIsPlaying(true);
    
    // Simular reproducción por 3 segundos
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentMusic(null);
    }, 3000);
  };

  const handlePause = () => {
    setIsPlaying(false);
    setCurrentMusic(null);
  };

  const handleSelectMusic = (music) => {
    onSelectMusic(music);
  };

  const clearSelection = () => {
    onSelectMusic(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b">
        <Music className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-lg">Seleccionar Música</h3>
        {selectedMusic && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelection}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            Quitar música
          </Button>
        )}
      </div>

      {/* Selected Music Display */}
      {selectedMusic && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Check className="w-4 h-4" />
            <span className="font-semibold text-sm">Música seleccionada:</span>
          </div>
          <div className="flex items-center gap-3">
            <img 
              src={selectedMusic.cover} 
              alt={selectedMusic.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold text-sm">{selectedMusic.title}</p>
              <p className="text-xs text-blue-600">{selectedMusic.artist}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar música por título o artista..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowRecommended(false);
          }}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {musicCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveCategory(category);
                setShowRecommended(false);
              }}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Recommended Music */}
      {showRecommended && recommendedMusic.length > 0 && !searchQuery && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <h4 className="font-semibold text-sm text-gray-700">
              Recomendado para tu publicación
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {recommendedMusic.slice(0, 3).map((music) => (
              <MusicCard
                key={music.id}
                music={music}
                isSelected={selectedMusic?.id === music.id}
                isPlaying={currentMusic?.id === music.id && isPlaying}
                onSelect={handleSelectMusic}
                onPlay={handlePlay}
                onPause={handlePause}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRecommended(false)}
            className="w-full text-sm text-gray-600 hover:text-gray-800"
          >
            Ver toda la biblioteca
          </Button>
        </div>
      )}

      {/* Music List */}
      {!showRecommended && (
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {filteredMusic.length > 0 ? (
              filteredMusic.map((music) => (
                <MusicCard
                  key={music.id}
                  music={music}
                  isSelected={selectedMusic?.id === music.id}
                  isPlaying={currentMusic?.id === music.id && isPlaying}
                  onSelect={handleSelectMusic}
                  onPlay={handlePlay}
                  onPause={handlePause}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No se encontró música que coincida con tu búsqueda</p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {/* Currently Playing */}
      {isPlaying && currentMusic && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">{currentMusic.title}</p>
              <p className="text-gray-300 text-xs">{currentMusic.artist}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePause}
            className="text-white hover:text-gray-300"
          >
            <Pause className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MusicSelector;