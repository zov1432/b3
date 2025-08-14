import React, { useState, useEffect } from "react";
import TikTokScrollView from '../components/TikTokScrollView';
import { mockPolls, createPoll } from '../services/mockData';
import { useToast } from '../hooks/use-toast';
import { useAddiction } from '../contexts/AddictionContext';
import { useTikTok } from '../contexts/TikTokContext';

const FeedPage = () => {
  const [polls, setPolls] = useState(mockPolls);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { trackAction } = useAddiction();
  const { enterTikTokMode, exitTikTokMode } = useTikTok();

  // Activar modo TikTok al montar el componente
  useEffect(() => {
    enterTikTokMode();
    // Simular carga inicial
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Limpiar al desmontar
    return () => {
      exitTikTokMode();
    };
  }, [enterTikTokMode, exitTikTokMode]);

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
    
    await triggerAction('vote');
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
    
    await triggerAction('like');
    toast({
      title: currentPoll?.userLiked ? "Like removido" : "¡Te gusta!",
      description: currentPoll?.userLiked ? "Ya no te gusta esta votación" : "Has dado like a esta votación",
    });
  };

  const handleShare = async (pollId) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          shares: poll.shares + 1
        };
      }
      return poll;
    }));
    
    await triggerAction('share');
    navigator.clipboard.writeText(`${window.location.origin}/poll/${pollId}`);
    toast({
      title: "¡Enlace copiado!",
      description: "El enlace de la votación ha sido copiado al portapapeles",
    });
  };

  const handleComment = async (pollId) => {
    await triggerAction('create');
    toast({
      title: "Comentarios",
      description: "Funcionalidad de comentarios próximamente",
    });
  };

  const handleSave = async (pollId) => {
    // Aquí podrías implementar la lógica para guardar en localStorage, backend, etc.
    await triggerAction('share'); // Usar share como acción similar
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
    await triggerAction('create');
    
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

  return (
    <TikTokScrollView
      polls={polls}
      onVote={handleVote}
      onLike={handleLike}
      onShare={handleShare}
      onComment={handleComment}
      onSave={handleSave}
      onExitTikTok={handleExitTikTok}
      onCreatePoll={handleCreatePoll}
    />
  );
};

export default FeedPage;