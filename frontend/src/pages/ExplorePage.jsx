import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import PollCard from '../components/PollCard';
import TikTokScrollView from '../components/TikTokScrollView';
import { 
  Search, TrendingUp, Filter, Users, Crown, Flame, Grid3X3, Play, 
  Star, Zap, Eye, Heart, MessageCircle, Share, ChevronDown,
  BarChart3, Sparkles, Target, Globe, Clock, Activity,
  ArrowUp, ArrowDown, Shuffle, SortDesc
} from 'lucide-react';
import { mockPolls, voteOnPoll, toggleLike } from '../services/mockData';
import { useToast } from '../hooks/use-toast';
import { useTikTok } from '../contexts/TikTokContext';
import { cn } from '../lib/utils';

// Enhanced Trending Card with Live Stats
const TrendingCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  trending, 
  color = "blue", 
  engagement = 0,
  growth = 0,
  liveUsers = 0
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="cursor-pointer"
  >
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg",
                color === "blue" && "bg-gradient-to-br from-blue-500 to-cyan-500",
                color === "green" && "bg-gradient-to-br from-green-500 to-emerald-500",
                color === "purple" && "bg-gradient-to-br from-purple-500 to-pink-500",
                color === "red" && "bg-gradient-to-br from-red-500 to-orange-500",
                color === "gold" && "bg-gradient-to-br from-yellow-500 to-orange-500"
              )}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{title}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  {subtitle}
                  {trending && (
                    <span className="flex items-center gap-1 text-red-500">
                      <Flame className="w-3 h-3" />
                      <span className="text-xs font-semibold">HOT</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <Badge 
                variant={trending ? "destructive" : "secondary"} 
                className={cn(
                  "font-bold text-xs",
                  trending && "animate-pulse shadow-lg"
                )}
              >
                {growth >= 0 ? `+${growth}%` : `${growth}%`}
              </Badge>
              <div className="text-xs text-gray-500">
                {liveUsers > 0 && (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {liveUsers} activos
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Live Engagement Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <motion.div 
              className={cn(
                "h-2 rounded-full",
                color === "blue" && "bg-gradient-to-r from-blue-500 to-cyan-500",
                color === "green" && "bg-gradient-to-r from-green-500 to-emerald-500",
                color === "purple" && "bg-gradient-to-r from-purple-500 to-pink-500",
                color === "red" && "bg-gradient-to-r from-red-500 to-orange-500",
                color === "gold" && "bg-gradient-to-r from-yellow-500 to-orange-500"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(engagement, 100)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Engagement: {engagement}%</span>
            <span className="flex items-center gap-1">
              {growth >= 0 ? <ArrowUp className="w-3 h-3 text-green-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />}
              Crecimiento
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Smart Filter Chip
const FilterChip = ({ label, isActive, onClick, count = 0, icon: Icon }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-sm border",
      isActive 
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-transparent" 
        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
    )}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span>{label}</span>
    {count > 0 && (
      <Badge 
        variant={isActive ? "secondary" : "default"}
        className={cn(
          "text-xs px-2",
          isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
        )}
      >
        {count}
      </Badge>
    )}
  </motion.button>
);

// Live Stats Dashboard
const LiveStatsDashboard = ({ polls }) => {
  const [liveStats, setLiveStats] = useState({
    totalVotes: 0,
    activeUsers: 0,
    trending: 0,
    newToday: 0
  });

  useEffect(() => {
    const stats = {
      totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
      activeUsers: Math.floor(Math.random() * 500) + 200,
      trending: polls.filter(p => p.totalVotes > 50).length,
      newToday: Math.floor(polls.length * 0.3)
    };
    setLiveStats(stats);
  }, [polls]);

  const statItems = [
    { 
      label: "Votos Totales", 
      value: liveStats.totalVotes.toLocaleString(), 
      icon: BarChart3, 
      color: "blue",
      change: "+12.3%"
    },
    { 
      label: "Usuarios Activos", 
      value: liveStats.activeUsers.toLocaleString(), 
      icon: Users, 
      color: "green",
      change: "+8.7%"
    },
    { 
      label: "Trending Ahora", 
      value: liveStats.trending, 
      icon: TrendingUp, 
      color: "purple",
      change: "+15.2%"
    },
    { 
      label: "Nuevas Hoy", 
      value: liveStats.newToday, 
      icon: Sparkles, 
      color: "gold",
      change: "+22.1%"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shadow-md",
                  stat.color === "blue" && "bg-gradient-to-br from-blue-500 to-cyan-500",
                  stat.color === "green" && "bg-gradient-to-br from-green-500 to-emerald-500",
                  stat.color === "purple" && "bg-gradient-to-br from-purple-500 to-pink-500",
                  stat.color === "gold" && "bg-gradient-to-br from-yellow-500 to-orange-500"
                )}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs text-green-600 bg-green-50">
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Poll Grid with Smart Layout
const SmartPollGrid = ({ polls, onVote, onLike, onShare, onComment }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {polls.map((poll, index) => (
        <motion.div
          key={poll.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.05,
            duration: 0.5,
            ease: "easeOut"
          }}
          whileHover={{ y: -8 }}
          className="group"
        >
          <div className="relative">
            <PollCard
              poll={poll}
              onVote={onVote}
              onLike={onLike}
              onShare={onShare}
              onComment={onComment}
            />
            {/* Floating engagement indicator */}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {poll.totalVotes > 100 ? "🔥 HOT" : poll.totalVotes > 50 ? "📈 RISING" : "✨ NEW"}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [sortBy, setSortBy] = useState('trending');
  const [polls, setPolls] = useState(mockPolls);
  const [viewMode, setViewMode] = useState('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { enterTikTokMode, exitTikTokMode } = useTikTok();
  const { toast } = useToast();

  // Enhanced categories with icons and counts
  const categories = [
    { name: 'Todo', icon: Globe, count: polls.length },
    { name: 'Trending', icon: TrendingUp, count: polls.filter(p => p.totalVotes > 50).length },
    { name: 'Moda', icon: Star, count: Math.floor(polls.length * 0.3) },
    { name: 'Comida', icon: Heart, count: Math.floor(polls.length * 0.2) },
    { name: 'Entretenimiento', icon: Sparkles, count: Math.floor(polls.length * 0.25) },
    { name: 'Deportes', icon: Target, count: Math.floor(polls.length * 0.15) }
  ];

  // Enhanced trending topics with live data
  const trendingTopics = [
    { 
      icon: Flame, 
      title: 'Outfits de verano 2025', 
      subtitle: '1.2M votaciones activas', 
      trending: true, 
      color: 'red',
      engagement: 87,
      growth: 24,
      liveUsers: 432
    },
    { 
      icon: Crown, 
      title: 'Mejor comida asiática', 
      subtitle: '856K participantes', 
      trending: true, 
      color: 'gold',
      engagement: 92,
      growth: 18,
      liveUsers: 287
    },
    { 
      icon: TrendingUp, 
      title: 'Bailes virales 2025', 
      subtitle: '642K views', 
      trending: false, 
      color: 'purple',
      engagement: 74,
      growth: 12,
      liveUsers: 156
    },
    { 
      icon: Sparkles, 
      title: 'Tech del futuro', 
      subtitle: '523K debates', 
      trending: true, 
      color: 'blue',
      engagement: 85,
      growth: 31,
      liveUsers: 203
    }
  ];

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