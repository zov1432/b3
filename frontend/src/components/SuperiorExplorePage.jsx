import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  Search, Filter, TrendingUp, Sparkles, Target, 
  Grid3X3, Shuffle, Zap, Award, Star, ChevronDown,
  Volume2, VolumeX, Settings, Heart, Flame
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { mockPolls, voteOnPoll, toggleLike } from '../services/mockData';
import { useToast } from '../hooks/use-toast';
import { useTikTok } from '../contexts/TikTokContext';
import AdvancedPollCard from './AdvancedExplorePage';

// Categorías dinámicas mejoradas
const CATEGORIES = [
  { id: 'all', name: 'Para Ti', icon: Sparkles, trending: true },
  { id: 'trending', name: 'Trending', icon: TrendingUp, count: 12 },
  { id: 'fashion', name: 'Moda', icon: Star },
  { id: 'food', name: 'Comida', icon: Heart },
  { id: 'dance', name: 'Baile', icon: Zap },
  { id: 'viral', name: 'Viral', icon: Flame },
];

// Modos de visualización
const VIEW_MODES = [
  { id: 'for-you', name: 'Para Ti', icon: Target },
  { id: 'discover', name: 'Descubrir', icon: Search },
  { id: 'following', name: 'Siguiendo', icon: Heart },
];

// Componente de filtros flotantes inteligentes
const SmartFilters = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  viewMode, 
  onViewModeChange,
  searchTerm,
  onSearchChange 
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <motion.div 
      className="absolute top-0 left-0 right-0 z-50 p-4 pt-safe"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {/* Header principal */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {VIEW_MODES.map((mode) => (
            <motion.button
              key={mode.id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all",
                viewMode === mode.id
                  ? "bg-white text-black shadow-lg"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange(mode.id)}
            >
              <mode.icon className="w-4 h-4" />
              <span>{mode.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white"
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white"
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Barra de búsqueda expandible */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="mb-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar encuestas, usuarios, temas..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-md border-white/20 text-white placeholder-white/60 rounded-full px-4 py-3"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categorías horizontales */}
      <motion.div 
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
        animate={{ 
          height: showFilters ? "auto" : 60,
          opacity: showFilters ? 1 : 0.8 
        }}
      >
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 flex-shrink-0 transition-all font-medium",
                isActive
                  ? "bg-white text-black shadow-lg scale-105"
                  : "bg-black/30 backdrop-blur-md text-white hover:bg-white/20 hover:scale-105"
              )}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category.id)}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{category.name}</span>
              
              {category.trending && (
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              
              {category.count && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {category.count}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Filtros adicionales */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="mt-3 flex items-center gap-2 overflow-x-auto scrollbar-hide"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {[
              { label: 'Más votados', icon: TrendingUp },
              { label: 'Recientes', icon: Sparkles },
              { label: 'Mis intereses', icon: Heart },
              { label: 'Virales', icon: Flame },
            ].map((filter, index) => (
              <motion.button
                key={filter.label}
                className="flex items-center gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-md text-white/80 rounded-full text-sm border border-white/10 flex-shrink-0 hover:bg-white/10 hover:text-white transition-all"
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <filter.icon className="w-3 h-3" />
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Componente principal de la página mejorada
const SuperiorExplorePage = () => {
  const [polls, setPolls] = useState(mockPolls);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('for-you');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({ top: 0, bottom: 0 });
  
  const containerRef = useRef(null);
  const { enterTikTokMode, exitTikTokMode } = useTikTok();
  const { toast } = useToast();

  // Entrar en modo TikTok automáticamente
  useEffect(() => {
    enterTikTokMode();
    return () => exitTikTokMode();
  }, [enterTikTokMode, exitTikTokMode]);

  // Configurar constraints de drag
  useEffect(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const totalHeight = polls.length * containerHeight;
      setDragConstraints({
        top: -(totalHeight - containerHeight),
        bottom: 0
      });
    }
  }, [polls.length]);

  // Filtrado inteligente de encuestas
  const filteredPolls = React.useMemo(() => {
    let filtered = [...polls];

    // Filtrar por categoría
    if (activeCategory !== 'all') {
      filtered = filtered.filter(poll => {
        const categoryMatches = {
          'trending': poll.totalVotes > 50,
          'fashion': poll.title.toLowerCase().includes('outfit') || poll.title.toLowerCase().includes('moda'),
          'food': poll.title.toLowerCase().includes('receta') || poll.title.toLowerCase().includes('comida'),
          'dance': poll.title.toLowerCase().includes('baile') || poll.title.toLowerCase().includes('dance'),
          'viral': poll.likes > 10000
        };
        return categoryMatches[activeCategory] || false;
      });
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(poll => 
        poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poll.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar según el modo de vista
    switch (viewMode) {
      case 'discover':
        return filtered.sort(() => Math.random() - 0.5); // Aleatorio
      case 'following':
        return filtered.filter(poll => poll.following); // Solo siguiendo
      default:
        return filtered.sort((a, b) => (b.totalVotes + b.likes) - (a.totalVotes + a.likes));
    }
  }, [polls, activeCategory, searchTerm, viewMode]);

  // Manejo de gestos mejorado
  const handleDragEnd = useCallback((event, info) => {
    const threshold = 100;
    const velocity = Math.abs(info.velocity.y);
    
    if (velocity > 500 || Math.abs(info.offset.y) > threshold) {
      if (info.offset.y < 0 && activeIndex < filteredPolls.length - 1) {
        // Scroll hacia abajo
        setActiveIndex(prev => prev + 1);
      } else if (info.offset.y > 0 && activeIndex > 0) {
        // Scroll hacia arriba
        setActiveIndex(prev => prev - 1);
      }
    }
  }, [activeIndex, filteredPolls.length]);

  // Handlers de interacción
  const handleVote = useCallback((pollId, optionId) => {
    const success = voteOnPoll(pollId, optionId);
    if (success) {
      setPolls([...mockPolls]);
      toast({
        title: "🎉 ¡Voto registrado!",
        description: "Tu voto ha sido contabilizado exitosamente",
      });
    }
  }, [toast]);

  const handleLike = useCallback((pollId) => {
    const liked = toggleLike(pollId);
    setPolls([...mockPolls]);
    toast({
      title: liked ? "💖 ¡Te gusta!" : "Like removido",
      description: liked ? "Has dado like a esta votación" : "Ya no te gusta esta votación",
    });
  }, [toast]);

  const handleShare = useCallback((pollId) => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${pollId}`);
    toast({
      title: "🔗 ¡Enlace copiado!",
      description: "El enlace ha sido copiado al portapapeles",
    });
  }, [toast]);

  const handleComment = useCallback((pollId) => {
    toast({
      title: "💬 Comentarios",
      description: "Abriendo comentarios...",
    });
  }, [toast]);

  const handleSave = useCallback((pollId) => {
    toast({
      title: "🔖 ¡Guardado!",
      description: "Encuesta guardada en tus favoritos",
    });
  }, [toast]);

  if (filteredPolls.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div 
          className="text-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Search className="w-12 h-12" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2">No se encontraron encuestas</h3>
          <p className="text-white/70">Intenta con otros filtros o términos de búsqueda</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Filtros inteligentes */}
      <SmartFilters
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Contenedor principal con scroll vertical */}
      <motion.div
        ref={containerRef}
        className="w-full h-full"
        drag="y"
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ 
          y: -activeIndex * window.innerHeight 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
      >
        {filteredPolls.map((poll, index) => (
          <AdvancedPollCard
            key={poll.id}
            poll={poll}
            isActive={index === activeIndex}
            onVote={handleVote}
            onLike={handleLike}
            onShare={handleShare}
            onComment={handleComment}
            onSave={handleSave}
            index={index}
            total={filteredPolls.length}
          />
        ))}
      </motion.div>

      {/* Botón de salida mejorado */}
      <motion.button
        className="fixed top-4 right-4 z-50 bg-black/40 backdrop-blur-md text-white p-3 rounded-full shadow-2xl"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => window.history.back()}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Grid3X3 className="w-5 h-5" />
      </motion.button>

      {/* Indicador de progreso global */}
      <motion.div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium z-50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {activeIndex + 1} de {filteredPolls.length}
      </motion.div>

      {/* CSS para scroll suave */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .pt-safe {
          padding-top: max(1rem, env(safe-area-inset-top));
        }
      `}</style>
    </div>
  );
};

export default SuperiorExplorePage;