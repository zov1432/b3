import React, { useState, useEffect } from "react";
import TikTokScrollView from '../components/TikTokScrollView';
import PollCard from '../components/PollCard';
import CommentsModal from '../components/CommentsModal';
import ShareModal from '../components/ShareModal';
import CustomLogo from '../components/CustomLogo';
import { mockPolls, createPoll } from '../services/mockData';
import { useToast } from '../hooks/use-toast';
import { useAddiction } from '../contexts/AddictionContext';
import { useTikTok } from '../contexts/TikTokContext';
import { useShare } from '../hooks/useShare';

const FeedPage = () => {
  const [polls, setPolls] = useState(mockPolls);
  const [isLoading, setIsLoading] = useState(true);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [selectedPollTitle, setSelectedPollTitle] = useState('');
  const [selectedPollAuthor, setSelectedPollAuthor] = useState('');
  const { toast } = useToast();
  const { trackAction } = useAddiction();
  const { enterTikTokMode, exitTikTokMode, isTikTokMode } = useTikTok();
  const { shareModal, sharePoll, closeShareModal } = useShare();

  // Detect if we're on mobile or desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Activar modo TikTok solo en móvil
  useEffect(() => {
    if (isMobile) {
      enterTikTokMode();
    } else {
      exitTikTokMode();
    }
    
    // Simular carga inicial
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Limpiar al desmontar
    return () => {
      if (isMobile) {
        exitTikTokMode();
      }
    };
  }, [isMobile, enterTikTokMode, exitTikTokMode]);

  const handleVote = async (pollId, optionId) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId && !poll.userVote) {
        return {
          ...poll,
          userVote: optionId,
          options: poll.options.map(opt => ({
            ...opt,
            votes: opt.id === optionId ? opt.votes + 1 : opt.votes
          })),
          totalVotes: poll.totalVotes + 1
        };
      }
      return poll;
    }));
    
    await trackAction('vote');
    toast({
      title: "¡Voto registrado!",
      description: "Tu voto ha sido contabilizado exitosamente",
    });
  };

  const handleLike = async (pollId) => {
    let currentPoll = null;
    
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        currentPoll = poll;
        return {
          ...poll,
          userLiked: !poll.userLiked,
          likes: poll.userLiked ? poll.likes - 1 : poll.likes + 1
        };
      }
      return poll;
    }));
    
    await trackAction('like');
    toast({
      title: currentPoll?.userLiked ? "Like removido" : "¡Te gusta!",
      description: currentPoll?.userLiked ? "Ya no te gusta esta votación" : "Has dado like a esta votación",
    });
  };

  const handleShare = async (pollId) => {
    // Actualizar el contador de shares
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          shares: poll.shares + 1
        };
      }
      return poll;
    }));
    
    await trackAction('share');
    
    // Obtener el poll para el modal
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;
    
    // Intentar usar Web Share API primero (mejor para móviles)
    if (navigator.share) {
      try {
        await navigator.share({
          title: poll.question || 'Vota en esta encuesta',
          text: 'Mira esta increíble votación',
          url: `${window.location.origin}/poll/${pollId}`,
        });
        toast({
          title: "¡Compartido exitosamente!",
          description: "La votación ha sido compartida",
        });
        return;
      } catch (err) {
        // Si el usuario cancela el share, no mostrar error
        if (err.name !== 'AbortError') {
          console.log('Error al compartir:', err);
          // Si Web Share API falla, usar modal
          sharePoll(poll);
        }
      }
    } else {
      // Si Web Share API no está disponible, usar modal
      sharePoll(poll);
    }
  };

  const handleComment = async (pollId) => {
    await trackAction('create');
    const poll = polls.find(p => p.id === pollId);
    if (poll) {
      setSelectedPollId(pollId);
      setSelectedPollTitle(poll.title);
      setSelectedPollAuthor(poll.author);
      setShowCommentsModal(true);
    }
  };

  const handleSave = async (pollId) => {
    // Aquí podrías implementar la lógica para guardar en localStorage, backend, etc.
    await trackAction('share'); // Usar share como acción similar
    toast({
      title: "¡Votación guardada!",
      description: "La votación ha sido guardada en tu colección",
    });
  };

  const handleExitTikTok = () => {
    // No hacer nada, ya que queremos mantener siempre el modo TikTok en el feed
    // Opcional: podrías navegar a otra página si quisieras
    return;
  };

  const handleCreatePoll = async (pollData) => {
    const newPoll = createPoll(pollData);
    
    // Agregar la nueva votación al inicio de la lista
    setPolls(prev => [newPoll, ...prev]);
    
    // Trigger addiction system
    await trackAction('create');
    
    toast({
      title: "¡Votación creada!",
      description: "Tu votación ha sido publicada exitosamente",
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white">Cargando tu feed...</h2>
          <p className="text-white/70 mt-2">Obteniendo las votaciones más recientes</p>
        </div>
      </div>
    );
  }

  // Si no hay polls, mostrar estado vacío
  if (polls.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Tu feed está vacío</h3>
          <p className="text-white/70 text-lg">¡Sigue a más usuarios para ver sus votaciones aquí!</p>
        </div>
      </div>
    );
  }

  // Renderizado móvil (TikTok mode)
  if (isMobile || isTikTokMode) {
    return (
      <div className="relative">
        {/* Logo fijo en la parte superior de la pantalla */}
        <div className="fixed top-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <CustomLogo size={24} className="text-white" />
        </div>
        
        <TikTokScrollView
          polls={polls}
          onVote={handleVote}
          onLike={handleLike}
          onShare={handleShare}
          onComment={handleComment}
          onSave={handleSave}
          onExitTikTok={handleExitTikTok}
          onCreatePoll={handleCreatePoll}
          showLogo={false}
        />
      </div>
    );
  }

  // Renderizado desktop (Web layout similar a TikTok web)
  return (
    <div className="min-h-screen bg-gray-50 pt-6 relative">
      {/* Logo personalizado en esquina superior derecha */}
      <div className="absolute top-6 right-6 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md">
        <CustomLogo size={28} className="text-gray-800" />
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Para ti</h1>
          <p className="text-gray-600">Descubre las votaciones más populares</p>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <div key={poll.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <PollCard
                poll={poll}
                onVote={handleVote}
                onLike={handleLike}
                onShare={handleShare}
                onComment={handleComment}
                onSave={handleSave}
                fullScreen={false}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12 mb-8">
          <button className="px-8 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors">
            Cargar más votaciones
          </button>
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        pollId={selectedPollId}
        pollTitle={selectedPollTitle}
        pollAuthor={selectedPollAuthor}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={closeShareModal}
        content={shareModal.content}
      />
    </div>
  );
};

export default FeedPage;