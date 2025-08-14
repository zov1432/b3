import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  Swords, Users, Clock, Trophy, Flame, Zap, Crown, 
  Play, Calendar, MessageCircle, Heart, Share, Star,
  Shield, Target, Award, Eye, Volume2, VolumeX,
  ChevronRight, Timer, Coins, TrendingUp, Fire,
  Send, Smile, ThumbsUp, MoreHorizontal, Settings
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { mockPolls } from '../services/mockData';

// Datos simulados para el chat en vivo
const generateChatMessage = () => {
  const users = [
    { name: 'TechGuru92', avatar: '👨‍💻', level: 'Pro' },
    { name: 'BattleMaster', avatar: '⚔️', level: 'Legend' },
    { name: 'StyleQueen', avatar: '👑', level: 'Expert' },
    { name: 'GameChanger', avatar: '🎮', level: 'Master' },
    { name: 'FireFox', avatar: '🔥', level: 'Elite' },
    { name: 'ThunderBolt', avatar: '⚡', level: 'Champion' },
    { name: 'NeonNinja', avatar: '🥷', level: 'Warrior' },
    { name: 'CyberSamurai', avatar: '🗡️', level: 'Gladiator' }
  ];

  const messages = [
    '¡Increíble batalla! 🔥',
    '¡Vamos Team Azul! 💙',
    'Esta es épica 😍',
    '¡No puedo creer lo que veo!',
    'Team Rojo FTW! ❤️',
    '¡Mejor batalla del año! 🏆',
    'Chat explota! 💥',
    '¡LEGENDARY BATTLE!',
    'Mis respetos a ambos 🙏',
    '¡FIRE BATTLE! 🔥🔥🔥',
    '¡Votando por la historia!',
    'Epic comeback incoming!',
    '¡Esta batalla es insana! 🤯',
    'GG WP ambos equipos',
    '¡HYPE TRAIN! 🚂💨',
    'Chat movido! 📱',
    '¡Momento histórico! 📜',
    'Battle royale vibes 👑'
  ];

  const reactions = ['🔥', '💥', '⚡', '🏆', '👏', '😱', '💯', '🎯', '⭐', '💎'];

  const user = users[Math.floor(Math.random() * users.length)];
  const isReaction = Math.random() < 0.3;
  
  if (isReaction) {
    return {
      id: Math.random().toString(),
      user,
      message: reactions[Math.floor(Math.random() * reactions.length)],
      timestamp: new Date().toLocaleTimeString(),
      type: 'reaction',
      highlighted: Math.random() < 0.1
    };
  }

  return {
    id: Math.random().toString(),
    user,
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date().toLocaleTimeString(),
    type: 'message',
    highlighted: Math.random() < 0.15
  };
};

// Hook para el chat en vivo
const useLiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isEnabled) return;

    // Generar mensajes iniciales
    const initialMessages = Array.from({ length: 8 }, generateChatMessage);
    setMessages(initialMessages.reverse());

    const interval = setInterval(() => {
      const newMessage = generateChatMessage();
      setMessages(prev => [...prev.slice(-50), newMessage]); // Mantener solo últimos 50 mensajes
    }, Math.random() * 2000 + 1000); // Entre 1-3 segundos

    return () => clearInterval(interval);
  }, [isEnabled]);

  const sendMessage = (message) => {
    const newMessage = {
      id: Math.random().toString(),
      user: { name: 'Tú', avatar: '😎', level: 'Viewer' },
      message,
      timestamp: new Date().toLocaleTimeString(),
      type: 'message',
      highlighted: false,
      isOwn: true
    };
    setMessages(prev => [...prev.slice(-50), newMessage]);
  };

  return { messages, isEnabled, setIsEnabled, sendMessage };
};

// Componente: Chat en Vivo
const LiveChatPanel = ({ messages, onSendMessage, isEnabled, onToggleChat }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <motion.div
      className="fixed right-6 top-24 bottom-24 w-80 bg-black/90 backdrop-blur-xl rounded-2xl border border-red-500/30 flex flex-col z-50"
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Header del Chat */}
      <div className="p-4 border-b border-red-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h3 className="text-white font-bold">Chat Live</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
              {messages.length} mensajes
            </Badge>
            <button
              onClick={onToggleChat}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Contador de espectadores en chat */}
        <div className="flex items-center gap-2 mt-2 text-sm text-white/70">
          <Eye className="w-4 h-4" />
          <span>15,847 espectadores activos</span>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-red-500/30">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={cn(
                "p-2 rounded-lg text-sm",
                msg.highlighted 
                  ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                  : msg.isOwn
                  ? "bg-blue-500/20 border border-blue-500/30 ml-8"
                  : "bg-white/5"
              )}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-2">
                <div className="text-lg">{msg.user.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "font-bold text-xs",
                      msg.isOwn ? "text-blue-300" : "text-white"
                    )}>
                      {msg.user.name}
                    </span>
                    <Badge className="bg-gray-600/50 text-gray-300 border-gray-500/30 text-xs px-1 py-0">
                      {msg.user.level}
                    </Badge>
                    <span className="text-white/50 text-xs">{msg.timestamp}</span>
                  </div>
                  
                  <div className={cn(
                    "text-white",
                    msg.type === 'reaction' ? "text-2xl" : "text-sm"
                  )}>
                    {msg.message}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input para enviar mensajes */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-red-500/30">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-red-500/50 focus:outline-none text-sm"
              maxLength={100}
            />
          </div>
          
          <div className="flex gap-1">
            <button
              type="button"
              className="p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => onSendMessage('🔥')}
            >
              <Smile className="w-4 h-4" />
            </button>
            
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Reacciones rápidas */}
        <div className="flex gap-1 mt-2">
          {['🔥', '💥', '👏', '😱', '🏆', '⚡'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSendMessage(emoji)}
              className="p-1 text-lg hover:bg-white/10 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </form>
    </motion.div>
  );
};

// Sistema de batallas live simulado - igual que antes pero con datos demo
const useLiveBattles = () => {
  const [activeBattles, setActiveBattles] = useState([]);
  const [scheduledBattles, setScheduledBattles] = useState([]);
  const [battleRooms, setBattleRooms] = useState([]);

  useEffect(() => {
    // Simular batallas activas
    setActiveBattles([
      {
        id: 'battle_tech_01',
        title: 'Tech War: AI vs Human',
        room: 'Tech Arena',
        status: 'live',
        viewers: 15847,
        duration: '05:32',
        maxDuration: '10:00',
        fighter1: {
          id: 'ai_master',
          name: 'AI Master',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          votes: 8924,
          winStreak: 7,
          level: 'Legend',
          energy: 78
        },
        fighter2: {
          id: 'human_genius',
          name: 'Human Genius',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
          votes: 6923,
          winStreak: 12,
          level: 'Master',
          energy: 85
        },
        category: 'tech',
        prizePool: '50K XP',
        battleType: 'sudden_death'
      },
      {
        id: 'battle_style_02',
        title: 'Fashion Showdown Supreme',
        room: 'Style Colosseum',
        status: 'live',
        viewers: 23190,
        duration: '03:18',
        maxDuration: '08:00',
        fighter1: {
          id: 'style_queen',
          name: 'Style Queen',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          votes: 12456,
          winStreak: 5,
          level: 'Pro',
          energy: 92
        },
        fighter2: {
          id: 'fashion_ninja',
          name: 'Fashion Ninja',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          votes: 10782,
          winStreak: 8,
          level: 'Expert',
          energy: 67
        },
        category: 'fashion',
        prizePool: '35K XP',
        battleType: 'best_of_3'
      }
    ]);

    // Simular batallas programadas
    setScheduledBattles([
      {
        id: 'scheduled_01',
        title: 'Food Fight Championship',
        participants: ['chef_master', 'culinary_god'],
        startTime: '18:30',
        category: 'food',
        prizePool: '100K XP',
        estimatedViewers: '50K+'
      },
      {
        id: 'scheduled_02', 
        title: 'Gaming Legends Clash',
        participants: ['pro_gamer', 'esports_king'],
        startTime: '20:00',
        category: 'gaming',
        prizePool: '75K XP',
        estimatedViewers: '30K+'
      }
    ]);

    // Simular salas de batalla
    setBattleRooms([
      {
        id: 'tech_arena',
        name: 'Tech Arena',
        theme: 'Cyberpunk',
        activeBattles: 3,
        totalUsers: 45678,
        difficulty: 'Expert',
        color: 'from-cyan-500 to-blue-600'
      },
      {
        id: 'style_colosseum',
        name: 'Style Colosseum',
        theme: 'Fashion',
        activeBattles: 5,
        totalUsers: 32145,
        difficulty: 'Pro',
        color: 'from-pink-500 to-purple-600'
      },
      {
        id: 'food_gladiator',
        name: 'Food Gladiator',
        theme: 'Culinary',
        activeBattles: 2,
        totalUsers: 28934,
        difficulty: 'Master',
        color: 'from-orange-500 to-red-600'
      },
      {
        id: 'game_arena',
        name: 'Game Arena', 
        theme: 'Gaming',
        activeBattles: 7,
        totalUsers: 67821,
        difficulty: 'Legend',
        color: 'from-green-500 to-teal-600'
      }
    ]);
  }, []);

  return { activeBattles, scheduledBattles, battleRooms };
};

// Componente: Live Battle Card épica (mejorada)
const LiveBattleCard = ({ battle, index, onJoinBattle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  useEffect(() => {
    // Simular progreso de batalla en tiempo real
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getVotePercentage = (fighter) => {
    const totalVotes = battle.fighter1.votes + battle.fighter2.votes;
    return Math.round((fighter.votes / totalVotes) * 100);
  };

  const winner = battle.fighter1.votes > battle.fighter2.votes ? battle.fighter1 : battle.fighter2;
  const loser = battle.fighter1.votes > battle.fighter2.votes ? battle.fighter2 : battle.fighter1;

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onJoinBattle(battle)}
    >
      {/* Background épico de batalla */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-black to-orange-900/80 rounded-3xl" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl border-2 border-red-500/30" />
      
      {/* Efectos de fuego animados */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-t from-red-500 to-orange-400 rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-5px'
            }}
            animate={{
              y: [-5, -80, -5],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* LIVE Badge pulsante */}
      <div className="absolute top-4 left-4 z-20">
        <motion.div
          className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-full font-bold text-sm"
          animate={{
            boxShadow: ['0 0 0px #ef4444', '0 0 20px #ef4444', '0 0 0px #ef4444']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </motion.div>
      </div>

      {/* Chat indicator */}
      <div className="absolute top-4 left-20 z-20">
        <motion.div
          className="flex items-center gap-1 px-2 py-1 bg-blue-600/80 text-white rounded-full text-xs"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MessageCircle className="w-3 h-3" />
          Chat
        </motion.div>
      </div>

      {/* Espectadores */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-sm">
          <Eye className="w-4 h-4 text-red-400" />
          <span className="font-bold">{battle.viewers.toLocaleString()}</span>
        </div>
      </div>

      {/* Contenido principal - igual que antes pero con mejoras visuales */}
      <div className="relative z-10 p-6 h-full">
        {/* Header de batalla */}
        <div className="text-center mb-6">
          <h2 className="text-white font-black text-xl mb-2">{battle.title}</h2>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
              {battle.room}
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              {battle.prizePool}
            </Badge>
          </div>
        </div>

        {/* VS Section épica */}
        <div className="relative mb-6">
          {/* Fighter 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <Avatar className="w-16 h-16 ring-4 ring-red-500/50">
                  <AvatarImage src={battle.fighter1.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold">
                    {battle.fighter1.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Crown para el ganador */}
                {winner.id === battle.fighter1.id && (
                  <motion.div
                    className="absolute -top-2 -right-2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Crown className="w-6 h-6 text-yellow-400 fill-current" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-bold">{battle.fighter1.name}</h3>
                <p className="text-orange-300 text-sm">{battle.fighter1.level}</p>
                
                {/* Barra de energía */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-xs">Energía</span>
                    <span className="text-white text-xs font-bold">{battle.fighter1.energy}%</span>
                  </div>
                  <Progress 
                    value={battle.fighter1.energy} 
                    className="h-2 bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* VS central con efectos mejorados */}
            <motion.div
              className="mx-6 relative"
              animate={{
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-lg">
                <Swords className="w-8 h-8 text-white" />
              </div>
              
              {/* Rayos de batalla mejorados */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-4 bg-yellow-400 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transformOrigin: 'bottom',
                      transform: `translate(-50%, -100%) rotate(${i * 45}deg) translateY(-20px)`
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Fighter 2 */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="flex-1 text-right">
                <h3 className="text-white font-bold">{battle.fighter2.name}</h3>
                <p className="text-blue-300 text-sm">{battle.fighter2.level}</p>
                
                {/* Barra de energía */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-bold">{battle.fighter2.energy}%</span>
                    <span className="text-white/70 text-xs">Energía</span>
                  </div>
                  <Progress 
                    value={battle.fighter2.energy} 
                    className="h-2 bg-gray-700"
                  />
                </div>
              </div>
              
              <div className="relative">
                <Avatar className="w-16 h-16 ring-4 ring-blue-500/50">
                  <AvatarImage src={battle.fighter2.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {battle.fighter2.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Crown para el ganador */}
                {winner.id === battle.fighter2.id && (
                  <motion.div
                    className="absolute -top-2 -left-2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Crown className="w-6 h-6 text-yellow-400 fill-current" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Barras de votación mejoradas */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-bold min-w-0">{battle.fighter1.votes.toLocaleString()}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${getVotePercentage(battle.fighter1)}%` }}
                  transition={{ duration: 1.5 }}
                />
              </div>
              <span className="text-orange-300 text-sm font-bold">
                {getVotePercentage(battle.fighter1)}%
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-blue-300 text-sm font-bold">
                {getVotePercentage(battle.fighter2)}%
              </span>
              <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${getVotePercentage(battle.fighter2)}%` }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
              </div>
              <span className="text-white text-sm font-bold min-w-0">{battle.fighter2.votes.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Timer y acciones mejoradas */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Timer className="w-4 h-4 text-red-400" />
              <span className="font-bold text-sm">{battle.duration}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/70">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Chat activo</span>
            </div>
          </div>
          
          <motion.button
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onJoinBattle(battle)}
          >
            UNIRSE A LA BATALLA
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente principal: Live Battle Demo Page  
const LiveBattleDemoPage = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [showChat, setShowChat] = useState(true);
  
  const { activeBattles, scheduledBattles, battleRooms } = useLiveBattles();
  const { messages, isEnabled: isChatEnabled, setIsEnabled: setChatEnabled, sendMessage } = useLiveChat();

  // Handlers
  const handleJoinBattle = (battle) => {
    console.log('Joining battle:', battle.title);
    sendMessage(`¡Uniéndome a ${battle.title}! 🔥`);
  };

  const handleEnterRoom = (room) => {
    console.log('Entering room:', room.name);
    sendMessage(`¡Entrando a ${room.name}! ⚔️`);
  };

  const handleSetReminder = (battle) => {
    console.log('Setting reminder for:', battle.title);
    sendMessage(`⏰ Recordatorio establecido para ${battle.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-orange-900 relative">
      {/* Background épico con efectos de batalla */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-orange-900/30" />
        
        {/* Efectos de chispas */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Chat en Vivo */}
      <AnimatePresence>
        {showChat && (
          <LiveChatPanel
            messages={messages}
            onSendMessage={sendMessage}
            isEnabled={isChatEnabled}
            onToggleChat={() => setChatEnabled(!isChatEnabled)}
          />
        )}
      </AnimatePresence>

      {/* Toggle Chat Button */}
      <motion.button
        className="fixed right-6 top-6 z-50 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
        onClick={() => setShowChat(!showChat)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Main Content */}
      <div className={cn(
        "relative z-10 min-h-screen overflow-y-auto pb-24 transition-all duration-300",
        showChat ? "pr-96" : "pr-6"
      )}>
        {/* Header épico */}
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 mb-4">
              BATTLE ARENA DEMO
            </h1>
            <p className="text-white/90 text-xl font-bold">
              🔥 BATALLAS ÉPICAS EN TIEMPO REAL CON CHAT LIVE 🔥
            </p>
            
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold">DEMO - Sin registro requerido</span>
            </div>
          </motion.div>

          {/* Stats globales */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-black text-red-400">12</div>
              <div className="text-white/80 text-sm">Batallas Live</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-orange-400">89K</div>
              <div className="text-white/80 text-sm">Espectadores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400">500K</div>
              <div className="text-white/80 text-sm">XP en Juego</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-400">Live</div>
              <div className="text-white/80 text-sm">Chat Activo</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 mb-8">
          <div className="flex items-center justify-center gap-2">
            {[
              { id: 'live', label: 'Batallas Live', icon: Flame },
              { id: 'rooms', label: 'Salas de Batalla', icon: Shield },
              { id: 'scheduled', label: 'Programadas', icon: Calendar },
              { id: 'chat', label: 'Chat Global', icon: MessageCircle }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6">
          <AnimatePresence mode="wait">
            {/* Batallas Live */}
            {activeTab === 'live' && (
              <motion.div
                key="live"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {activeBattles.map((battle, index) => (
                  <LiveBattleCard
                    key={battle.id}
                    battle={battle}
                    index={index}
                    onJoinBattle={handleJoinBattle}
                  />
                ))}
              </motion.div>
            )}

            {/* Chat Global Tab */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <MessageCircle className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                <h2 className="text-white font-bold text-3xl mb-4">Chat Global de Batallas</h2>
                <p className="text-white/70 text-lg mb-6">
                  El chat está disponible en el panel lateral derecho
                </p>
                
                {!showChat && (
                  <motion.button
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setShowChat(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Abrir Chat Live
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Otras tabs igual que antes... */}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LiveBattleDemoPage;