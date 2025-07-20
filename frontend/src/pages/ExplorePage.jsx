import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import PollCard from '../components/PollCard';
import TikTokScrollView from '../components/TikTokScrollView';
import { Search, TrendingUp, Filter, Users, Crown, Flame, Grid3X3, Play } from 'lucide-react';
import { mockPolls, voteOnPoll, toggleLike } from '../services/mockData';
import { useToast } from '../hooks/use-toast';
import { useTikTok } from '../contexts/TikTokContext';
import { cn } from '../lib/utils';

const TrendingCard = ({ icon: Icon, title, subtitle, trending, color = "blue" }) => (
  <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            color === "blue" && "bg-blue-100 text-blue-600 group-hover:bg-blue-200",
            color === "green" && "bg-green-100 text-green-600 group-hover:bg-green-200",
            color === "purple" && "bg-purple-100 text-purple-600 group-hover:bg-purple-200",
            color === "red" && "bg-red-100 text-red-600 group-hover:bg-red-200"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        <Badge variant={trending ? "default" : "secondary"} className={cn(
          trending && "bg-red-600 hover:bg-red-700 animate-pulse"
        )}>
          {trending ? "Trending" : "Popular"}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

const CategoryButton = ({ category, isActive, onClick }) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="sm"
    onClick={() => onClick(category)}
    className={cn(
      "transition-all duration-300",
      isActive 
        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
        : "hover:bg-gray-50"
    )}
  >
    {category}
  </Button>
);

const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [polls, setPolls] = useState(mockPolls);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'tiktok'
  const { enterTikTokMode, exitTikTokMode } = useTikTok();
  const { toast } = useToast();

  // Handle TikTok mode toggle
  const handleTikTokMode = () => {
    if (viewMode === 'grid') {
      setViewMode('tiktok');
      enterTikTokMode();
    } else {
      setViewMode('grid');
      exitTikTokMode();
    }
  };

  const handleExitTikTok = () => {
    setViewMode('grid');
    exitTikTokMode();
  };

  const categories = ['Todo', 'Trending', 'Moda', 'Comida', 'Entretenimiento', 'Deportes'];

  const trendingTopics = [
    { 
      icon: Flame, 
      title: 'Outfits de verano 2025', 
      subtitle: '1.2M votaciones', 
      trending: true, 
      color: 'red' 
    },
    { 
      icon: Crown, 
      title: 'Mejor comida asiática', 
      subtitle: '856K votaciones', 
      trending: true, 
      color: 'purple' 
    },
    { 
      icon: TrendingUp, 
      title: 'Bailes de TikTok', 
      subtitle: '642K votaciones', 
      trending: false, 
      color: 'blue' 
    },
    { 
      icon: Users, 
      title: 'Memes del año', 
      subtitle: '423K votaciones', 
      trending: false, 
      color: 'green' 
    }
  ];

  // Filter polls based on search and category
  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === 'Todo') return matchesSearch;
    if (activeCategory === 'Trending') return matchesSearch && poll.totalVotes > 50;
    
    // Simple category matching (in real app, polls would have category tags)
    const categoryMatches = {
      'Moda': poll.title.toLowerCase().includes('outfit') || poll.title.toLowerCase().includes('ganó'),
      'Comida': poll.title.toLowerCase().includes('receta') || poll.title.toLowerCase().includes('comida'),
      'Entretenimiento': poll.title.toLowerCase().includes('baile') || poll.title.toLowerCase().includes('tiktok'),
      'Deportes': false // No sports polls in mock data
    };
    
    return matchesSearch && (categoryMatches[activeCategory] || false);
  });

  const handleVote = (pollId, optionId) => {
    const success = voteOnPoll(pollId, optionId);
    if (success) {
      setPolls([...mockPolls]);
      toast({
        title: "¡Voto registrado!",
        description: "Tu voto ha sido contabilizado exitosamente",
      });
    }
  };

  const handleLike = (pollId) => {
    const liked = toggleLike(pollId);
    setPolls([...mockPolls]);
    toast({
      title: liked ? "¡Te gusta!" : "Like removido",
      description: liked ? "Has dado like a esta votación" : "Ya no te gusta esta votación",
    });
  };

  const handleShare = (pollId) => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${pollId}`);
    toast({
      title: "¡Enlace copiado!",
      description: "El enlace de la votación ha sido copiado al portapapeles",
    });
  };

  const handleComment = (pollId) => {
    toast({
      title: "Comentarios",
      description: "Funcionalidad de comentarios próximamente",
    });
  };

  return (
    <div className={cn(
      "min-h-screen pb-20",
      viewMode === 'tiktok' 
        ? "bg-black overflow-hidden" 
        : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
    )}>
      {/* Header - Only show in grid mode */}
      {viewMode === 'grid' && (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Explorar</h1>
              </div>
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleExitTikTok()}
                    className={cn(
                      "h-8 px-3",
                      viewMode === 'grid' 
                        ? "bg-white shadow-sm" 
                        : "hover:bg-gray-200"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'tiktok' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleTikTokMode()}
                    className={cn(
                      "h-8 px-3",
                      viewMode === 'tiktok' 
                        ? "bg-white shadow-sm" 
                        : "hover:bg-gray-200"
                    )}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                  <Filter className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* TikTok Mode - Full Screen Immersive */}
      {viewMode === 'tiktok' && (
        <TikTokScrollView
          polls={filteredPolls}
          onVote={handleVote}
          onLike={handleLike}
          onShare={handleShare}
          onComment={handleComment}
          onExitTikTok={() => setViewMode('grid')}
        />
      )}

      {/* Grid Mode - Original Layout */}
      {viewMode === 'grid' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar votaciones, usuarios, temas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base bg-white shadow-sm focus:shadow-md transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                isActive={activeCategory === category}
                onClick={setActiveCategory}
              />
            ))}
          </div>

          {/* Trending Topics */}
          {!searchTerm && activeCategory === 'Todo' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-gray-900">Temas Populares</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingTopics.map((topic, index) => (
                  <TrendingCard
                    key={index}
                    icon={topic.icon}
                    title={topic.title}
                    subtitle={topic.subtitle}
                    trending={topic.trending}
                    color={topic.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {searchTerm ? `Resultados para "${searchTerm}"` : 
                 activeCategory === 'Todo' ? 'Todas las votaciones' : `Categoría: ${activeCategory}`}
              </h2>
              <p className="text-sm text-gray-600">{filteredPolls.length} votaciones encontradas</p>
            </div>
          </div>

          {/* Polls Grid */}
          {filteredPolls.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay votaciones en esta categoría'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Prueba con otra categoría o crea la primera votación'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPolls.map((poll, index) => (
                <div 
                  key={poll.id}
                  className="animate-fade-in opacity-0"
                  style={{
                    animation: 'fadeIn 0.6s ease-out forwards',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <PollCard
                    poll={poll}
                    onVote={handleVote}
                    onLike={handleLike}
                    onShare={handleShare}
                    onComment={handleComment}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ExplorePage;