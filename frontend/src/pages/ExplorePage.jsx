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