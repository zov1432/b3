import React, { useState, useMemo } from 'react';
import TikTokScrollView from '../components/TikTokScrollView';
import { mockPolls, voteOnPoll, toggleLike } from '../services/mockData';
import { useToast } from '../hooks/use-toast';
import { useTikTok } from '../contexts/TikTokContext';

const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [sortBy, setSortBy] = useState('trending');
  const [polls, setPolls] = useState(mockPolls);
  const { enterTikTokMode, exitTikTokMode } = useTikTok();
  const { toast } = useToast();

  // Auto-enter TikTok mode when component mounts
  React.useEffect(() => {
    enterTikTokMode();
    return () => exitTikTokMode(); // Clean up when leaving
  }, [enterTikTokMode, exitTikTokMode]);

  // Smart filtering and sorting
  const filteredAndSortedPolls = useMemo(() => {
    let filtered = polls.filter(poll => {
      const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poll.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeCategory === 'Todo') return matchesSearch;
      if (activeCategory === 'Trending') return matchesSearch && poll.totalVotes > 50;
      
      const categoryMatches = {
        'Moda': poll.title.toLowerCase().includes('outfit') || poll.title.toLowerCase().includes('ganó'),
        'Comida': poll.title.toLowerCase().includes('receta') || poll.title.toLowerCase().includes('comida'),
        'Entretenimiento': poll.title.toLowerCase().includes('baile') || poll.title.toLowerCase().includes('tiktok'),
        'Deportes': poll.title.toLowerCase().includes('deporte') || poll.title.toLowerCase().includes('futbol')
      };
      
      return matchesSearch && (categoryMatches[activeCategory] || false);
    });

    // Smart sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return (b.totalVotes + b.comments * 2) - (a.totalVotes + a.comments * 2);
        case 'newest':
          return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
        case 'mostVoted':
          return b.totalVotes - a.totalVotes;
        case 'engagement':
          return (b.totalVotes + b.comments + (b.userLiked ? 1 : 0)) - (a.totalVotes + a.comments + (a.userLiked ? 1 : 0));
        default:
          return 0;
      }
    });

    return filtered;
  }, [polls, searchTerm, activeCategory, sortBy]);

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

  const handleExitTikTok = () => {
    // Since we removed grid mode, exit will go back to feed
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Pure TikTok Experience - Full Screen Immersive */}
      <TikTokScrollView
        polls={filteredAndSortedPolls}
        onVote={handleVote}
        onLike={handleLike}
        onShare={handleShare}
        onComment={handleComment}
        onExitTikTok={handleExitTikTok}
      />
    </div>
  );
};

export default ExplorePage;

  // Handlers remain the same
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
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
    )}>
      {/* Enhanced Header with Live Indicators */}
      {viewMode === 'grid' && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Explorar
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>{Math.floor(Math.random() * 500) + 200} usuarios activos</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Advanced Sort Dropdown */}
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <option value="trending">🔥 Trending</option>
                    <option value="newest">🆕 Más nuevas</option>
                    <option value="mostVoted">📊 Más votadas</option>
                    <option value="engagement">⚡ Más engagement</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Toggle with Enhanced Design */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shadow-inner">
                  <Button
                    variant={viewMode === 'grid' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleExitTikTok()}
                    className={cn(
                      "h-9 px-4 transition-all duration-300",
                      viewMode === 'grid' 
                        ? "bg-white shadow-lg scale-105" 
                        : "hover:bg-gray-200/80"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'tiktok' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleTikTokMode()}
                    className={cn(
                      "h-9 px-4 transition-all duration-300",
                      viewMode === 'tiktok' 
                        ? "bg-white shadow-lg scale-105" 
                        : "hover:bg-gray-200/80"
                    )}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    TikTok
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* TikTok Mode - Full Screen Immersive */}
      {viewMode === 'tiktok' && (
        <TikTokScrollView
          polls={filteredAndSortedPolls}
          onVote={handleVote}
          onLike={handleLike}
          onShare={handleShare}
          onComment={handleComment}
          onExitTikTok={handleExitTikTok}
        />
      )}

      {/* Enhanced Grid Mode */}
      {viewMode === 'grid' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Live Stats Dashboard */}
          <LiveStatsDashboard polls={polls} />

          {/* Enhanced Search Bar with AI Suggestions */}
          <div className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Descubre votaciones trending, usuarios populares, temas virales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-16 h-14 text-base bg-white shadow-lg focus:shadow-2xl transition-all duration-300 border-0 rounded-2xl font-medium"
              />
              <Button 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                IA
              </Button>
            </div>
          </div>

          {/* Smart Category Filters */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((category) => (
              <FilterChip
                key={category.name}
                label={category.name}
                icon={category.icon}
                count={category.count}
                isActive={activeCategory === category.name}
                onClick={() => setActiveCategory(category.name)}
              />
            ))}
            <FilterChip
              label="Filtros Avanzados"
              icon={Filter}
              isActive={showAdvancedFilters}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            />
          </div>

          {/* Enhanced Trending Topics */}
          {!searchTerm && activeCategory === 'Todo' && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Trending Ahora</h2>
                </div>
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                  🔴 LIVE
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingTopics.map((topic, index) => (
                  <TrendingCard
                    key={index}
                    icon={topic.icon}
                    title={topic.title}
                    subtitle={topic.subtitle}
                    trending={topic.trending}
                    color={topic.color}
                    engagement={topic.engagement}
                    growth={topic.growth}
                    liveUsers={topic.liveUsers}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results Header with Smart Analytics */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {searchTerm ? (
                  <span>
                    Resultados para <span className="text-blue-600">"{searchTerm}"</span>
                  </span>
                ) : activeCategory === 'Todo' ? 'Todas las votaciones' : (
                  <span>
                    Categoría: <span className="text-purple-600">{activeCategory}</span>
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  {filteredAndSortedPolls.length} encontradas
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  {filteredAndSortedPolls.reduce((sum, poll) => sum + poll.totalVotes, 0).toLocaleString()} votos
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Actualizado hace {Math.floor(Math.random() * 5) + 1}min
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPolls([...polls].reverse())}
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
            >
              <Shuffle className="w-4 h-4" />
              Aleatorio
            </Button>
          </div>

          {/* Enhanced Results Display */}
          {filteredAndSortedPolls.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {searchTerm ? '🔍 Sin resultados' : '📂 Categoría vacía'}
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? `No encontramos votaciones para "${searchTerm}". Intenta con otros términos.`
                  : 'Esta categoría aún no tiene contenido. ¡Sé el primero en crear una votación!'
                }
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Explorar Todo
              </Button>
            </motion.div>
          ) : (
            <SmartPollGrid
              polls={filteredAndSortedPolls}
              onVote={handleVote}
              onLike={handleLike}
              onShare={handleShare}
              onComment={handleComment}
            />
          )}
        </div>
      )}

      <style jsx>{`
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