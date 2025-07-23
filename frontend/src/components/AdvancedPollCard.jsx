import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Heart, MessageCircle, Share, Bookmark, MoreHorizontal, 
  Play, Pause, VolumeX, Volume2, TrendingUp, Zap, 
  Sparkles, Award, Crown, Star, ChevronUp, ChevronDown,
  Filter, Search, Grid3X3, Shuffle, Target, Eye
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

// Efectos de partículas para interacciones
const ParticleEffect = ({ x, y, type, show, onComplete }) => {
  if (!show) return null;
  
  const particles = Array.from({ length: type === 'love' ? 12 : 8 }, (_, i) => ({
    id: i,
    delay: i * 0.05,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5
  }));

  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{ left: x - 20, top: y - 20 }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={cn(
            "absolute w-6 h-6 rounded-full",
            type === 'love' ? "bg-red-500" : 
            type === 'star' ? "bg-yellow-400" :
            type === 'fire' ? "bg-orange-500" : "bg-blue-500"
          )}
          initial={{ 
            scale: 0, 
            rotate: 0,
            x: 0,
            y: 0,
            opacity: 1
          }}
          animate={{ 
            scale: [0, particle.scale, 0],
            rotate: particle.rotation,
            x: (Math.random() - 0.5) * 100,
            y: -50 - Math.random() * 50,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1.2,
            delay: particle.delay,
            ease: "easeOut"
          }}
          onAnimationComplete={() => particle.id === particles.length - 1 && onComplete()}
        >
          {type === 'love' && <Heart className="w-4 h-4 text-white fill-current" />}
          {type === 'star' && <Star className="w-4 h-4 text-white fill-current" />}
          {type === 'fire' && <Zap className="w-4 h-4 text-white fill-current" />}
        </motion.div>
      ))}
    </div>
  );
};

// Componente de reacción rápida - OPTIMIZADO MÓVIL
const QuickReaction = ({ icon: Icon, label, count, isActive, onClick, position = "right" }) => {
  const [showPulse, setShowPulse] = useState(false);

  const handleClick = () => {
    setShowPulse(true);
    onClick();
    setTimeout(() => setShowPulse(false), 300);
  };

  return (
    <motion.button
      className={cn(
        "flex flex-col items-center gap-1 p-3 rounded-full backdrop-blur-md transition-all duration-200 touch-manipulation min-h-[60px] min-w-[60px] active:scale-90",
        isActive 
          ? "bg-white/40 text-white shadow-lg" 
          : "bg-black/30 text-white/90 hover:bg-white/25 hover:text-white active:bg-white/35"
      )}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      animate={showPulse ? { 
        boxShadow: [
          "0 0 0 0 rgba(255, 255, 255, 0.4)",
          "0 0 0 20px rgba(255, 255, 255, 0)",
        ]
      } : {}}
      transition={{ duration: 0.3 }}
    >
      <Icon className={cn(
        "w-6 h-6 transition-all flex-shrink-0",
        isActive && "fill-current scale-110"
      )} />
      <span className="text-xs font-bold leading-none">{count > 999 ? `${(count/1000).toFixed(1)}K` : count}</span>
    </motion.button>
  );
};

// Componente de filtro inteligente flotante
const SmartFilter = ({ categories, activeCategory, onCategoryChange, trending }) => {
  return (
    <motion.div 
      className="absolute top-4 left-4 right-4 z-40"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
        <motion.button
          className="flex items-center gap-2 bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 flex-shrink-0"
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtros</span>
        </motion.button>
        
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 flex-shrink-0 transition-all",
              activeCategory === category.id
                ? "bg-white text-black shadow-lg"
                : "bg-black/30 backdrop-blur-md text-white hover:bg-white/20"
            )}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.id)}
          >
            {trending.includes(category.id) && (
              <TrendingUp className="w-3 h-3 text-red-500" />
            )}
            <span className="text-sm font-medium">{category.name}</span>
            {category.count && (
              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                {category.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Componente principal de tarjeta de encuesta mejorada
const AdvancedPollCard = ({ 
  poll, 
  isActive, 
  onVote, 
  onLike, 
  onShare, 
  onComment,
  onSave,
  index,
  total 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showParticles, setShowParticles] = useState(null);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [volume, setVolume] = useState(0.7);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const cardRef = useRef(null);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0, 100], [0.8, 1, 0.8]);
  const scale = useTransform(y, [-100, 0, 100], [0.95, 1, 0.95]);

  // Gesture handlers mejorados
  const handleSwipeLeft = useCallback(() => {
    // Swipe izquierda = Like rápido
    onLike(poll.id);
    setShowParticles({ type: 'love', x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, [poll.id, onLike]);

  const handleSwipeRight = useCallback(() => {
    // Swipe derecha = Guardar
    onSave && onSave(poll.id);
    setShowParticles({ type: 'star', x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, [poll.id, onSave]);

  const handleDoubleClick = useCallback((e) => {
    // Double tap en diferentes zonas
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = e.clientX - rect.left;
    const isLeftSide = clickX < rect.width / 2;
    
    if (isLeftSide) {
      handleSwipeLeft();
    } else {
      onShare(poll.id);
      setShowParticles({ type: 'fire', x: e.clientX, y: e.clientY });
    }
  }, [handleSwipeLeft, onShare, poll.id]);

  const handleVote = useCallback((optionId) => {
    if (selectedOption) return;
    setSelectedOption(optionId);
    onVote(poll.id, optionId);
    
    // Efecto visual para el voto
    setShowParticles({ 
      type: 'star', 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    });
  }, [selectedOption, onVote, poll.id]);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getWinningOption = () => {
    return poll.options.reduce((max, option) => 
      option.votes > max.votes ? option : max
    );
  };

  const getPercentage = (votes) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  const winningOption = getWinningOption();

  return (
    <motion.div
      ref={cardRef}
      className="w-full h-screen flex flex-col relative snap-start snap-always overflow-hidden"
      style={{ opacity, scale, y }}
      onDoubleClick={handleDoubleClick}
      onHoverStart={() => setShowQuickActions(true)}
      onHoverEnd={() => setShowQuickActions(false)}
    >
      {/* Fondo con gradiente dinámico */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Efectos de fondo animados */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #4f46e5 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, #2563eb 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header mejorado - MÓVIL */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-30 p-4 pt-safe-mobile"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="ring-2 ring-white/50 w-12 h-12 flex-shrink-0">
              <AvatarImage src={poll.author.avatar || "https://github.com/shadcn.png"} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                {poll.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white text-base truncate">{poll.author}</h3>
              <p className="text-sm text-white/70 truncate">{poll.timeAgo}</p>
            </div>
            <motion.button
              className="ml-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold flex-shrink-0 active:scale-95 transition-transform touch-manipulation"
              whileTap={{ scale: 0.92 }}
            >
              Seguir
            </motion.button>
          </div>
          
          <motion.button
            className="p-2.5 bg-black/30 backdrop-blur-md rounded-full ml-3 flex-shrink-0 active:bg-black/50 transition-colors touch-manipulation"
            whileTap={{ scale: 0.88 }}
          >
            <MoreHorizontal className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Contenido principal - Grid mejorado MÓVIL */}
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-40">
        <div className="w-full max-w-sm">
          {/* Título con efectos - MÓVIL */}
          <motion.div 
            className="text-center mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white leading-tight mb-3 px-2">
              {poll.title}
            </h2>
            <div className="flex items-center justify-center gap-3 text-white/80">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{formatNumber(poll.totalVotes)}</span>
              </div>
              <div className="w-1 h-1 bg-white/50 rounded-full" />
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Trending</span>
              </div>
            </div>
          </motion.div>

          {/* Grid de opciones con efectos 3D - OPTIMIZADO MÓVIL */}
          <motion.div 
            className="grid grid-cols-2 gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {poll.options.map((option, optionIndex) => {
              const percentage = getPercentage(option.votes);
              const isWinner = option.id === winningOption.id && poll.totalVotes > 0;
              const isSelected = selectedOption === option.id;

              return (
                <motion.div
                  key={option.id}
                  className="relative aspect-square cursor-pointer group touch-manipulation"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleVote(option.id)}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  {/* Fondo de la opción */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    {option.media?.url ? (
                      <img 
                        src={option.media.url} 
                        alt={option.text}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={cn(
                        "w-full h-full",
                        optionIndex === 0 ? "bg-gradient-to-br from-pink-500 to-rose-500" :
                        optionIndex === 1 ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                        optionIndex === 2 ? "bg-gradient-to-br from-purple-500 to-violet-500" :
                        "bg-gradient-to-br from-orange-500 to-red-500"
                      )} />
                    )}
                  </div>

                  {/* Overlay de progreso animado */}
                  <motion.div 
                    className={cn(
                      "absolute inset-0 rounded-2xl",
                      isSelected 
                        ? "bg-gradient-to-t from-blue-600/80 to-blue-400/40"
                        : isWinner 
                          ? "bg-gradient-to-t from-green-600/80 to-green-400/40"
                          : "bg-gradient-to-t from-black/60 to-transparent"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: poll.totalVotes > 0 ? 1 : 0,
                      background: isSelected ? [
                        "linear-gradient(to top, rgba(37, 99, 235, 0.8), rgba(96, 165, 250, 0.4))",
                        "linear-gradient(to top, rgba(59, 130, 246, 0.9), rgba(147, 197, 253, 0.5))",
                        "linear-gradient(to top, rgba(37, 99, 235, 0.8), rgba(96, 165, 250, 0.4))"
                      ] : undefined
                    }}
                    transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
                  />

                  {/* Indicador de porcentaje - MÓVIL */}
                  <motion.div 
                    className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: poll.totalVotes > 0 ? 1 : 0 }}
                    transition={{ delay: 0.5 + optionIndex * 0.1 }}
                  >
                    {percentage}%
                  </motion.div>

                  {/* Avatar del usuario - MÓVIL */}
                  <div className="absolute top-2 left-2">
                    <Avatar className="w-7 h-7 ring-2 ring-white/50">
                      <AvatarImage src={option.user?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold">
                        {option.user?.displayName?.charAt(0) || option.id.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Badge de ganador - MÓVIL */}
                  {isWinner && poll.totalVotes > 0 && (
                    <motion.div 
                      className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 1 }}
                    >
                      <Crown className="w-3 h-3" />
                      <span className="hidden xs:inline">Ganador</span>
                    </motion.div>
                  )}

                  {/* Texto de la opción - MÓVIL */}
                  <div className="absolute bottom-2 right-2 left-2 text-center">
                    <p className="text-white font-bold text-xs bg-black/70 backdrop-blur-sm px-2 py-1.5 rounded-lg line-clamp-2 leading-tight">
                      {option.text}
                    </p>
                  </div>

                  {/* Efecto de hover/touch */}
                  <motion.div 
                    className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Acciones laterales mejoradas - MÓVIL */}
      <AnimatePresence>
        <motion.div 
          className="absolute right-3 bottom-40 flex flex-col gap-2 z-40"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <QuickReaction
            icon={Heart}
            label="Me gusta"
            count={poll.likes}
            isActive={poll.userLiked}
            onClick={() => handleSwipeLeft()}
          />
          
          <QuickReaction
            icon={MessageCircle}
            label="Comentar"
            count={poll.comments}
            isActive={false}
            onClick={() => onComment(poll.id)}
          />
          
          <QuickReaction
            icon={Share}
            label="Compartir"
            count={poll.shares}
            isActive={false}
            onClick={() => onShare(poll.id)}
          />
          
          <QuickReaction
            icon={Bookmark}
            label="Guardar"
            count={0}
            isActive={false}
            onClick={() => handleSwipeRight()}
          />
        </motion.div>
      </AnimatePresence>

      {/* Player de música mejorado - MÓVIL */}
      {poll.music && (
        <motion.div 
          className="absolute bottom-24 left-4 bg-black/40 backdrop-blur-md rounded-full p-2.5 flex items-center gap-3 max-w-[calc(100%-120px)] border border-white/10"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform touch-manipulation"
            whileTap={{ scale: 0.85 }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </motion.button>
          
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {poll.music.title}
            </p>
            <p className="text-white/70 text-xs truncate">
              {poll.music.artist}
            </p>
          </div>
          
          {/* Visualizador de ondas - MÓVIL */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-white rounded-full"
                animate={isPlaying ? {
                  height: [4, 16, 8, 20, 6, 14],
                } : { height: 4 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Indicador de progreso lateral - MÓVIL */}
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col gap-1.5 z-30">
        {Array.from({ length: total }, (_, i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full transition-all duration-300",
              i === index
                ? "bg-white w-1.5 h-6 shadow-lg"
                : "bg-white/40 w-1 h-4"
            )}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      {/* Efectos de partículas */}
      <AnimatePresence>
        {showParticles && (
          <ParticleEffect
            {...showParticles}
            show={true}
            onComplete={() => setShowParticles(null)}
          />
        )}
      </AnimatePresence>

      {/* Hints de navegación - MÓVIL */}
      {index === 0 && (
        <motion.div 
          className="absolute bottom-48 left-1/2 transform -translate-x-1/2 text-center text-white/80 px-4 max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronUp className="w-6 h-6 mx-auto mb-2" />
          </motion.div>
          <p className="text-sm font-medium mb-1">Desliza para explorar</p>
          <p className="text-xs leading-relaxed">← Swipe para me gusta | Swipe para guardar →</p>
        </motion.div>
      )}
      
      {/* CSS específico para móviles */}
      <style jsx>{`
        .pt-safe-mobile {
          padding-top: max(16px, env(safe-area-inset-top));
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        @media (max-width: 375px) {
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AdvancedPollCard;