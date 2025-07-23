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
          onExitTikTok={handleExitTikTok}
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