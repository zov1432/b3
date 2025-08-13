import React, { useState, useEffect } from "react";
import TikTokScrollView from '../components/TikTokScrollView';
import { mockPolls } from '../services/mockData';
import { useToast } from '../hooks/use-toast';
import { useAddiction } from '../contexts/AddictionContext';
import { useTikTok } from '../contexts/TikTokContext';

const FeedPage = () => {
  const [polls, setPolls] = useState(mockPolls);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Cargando tu feed...</h2>
          <p className="text-gray-500 mt-2">Obteniendo las votaciones más recientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tu Feed
                </h1>
                <p className="text-xs text-gray-500">Votaciones de quienes sigues</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">{polls.length} nuevas</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">23M participantes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {polls.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Tu feed está vacío</h3>
            <p className="text-gray-600 mb-6">¡Sigue a más usuarios para ver sus votaciones aquí!</p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Explorar usuarios
            </Button>
          </div>
        ) : (
          <>
            {/* Feed Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Votaciones Recientes
              </h2>
              <p className="text-gray-600">
                Las últimas votaciones de tus amigos y usuarios favoritos
              </p>
            </div>

            {/* Polls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {polls.map((poll, index) => (
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
          </>
        )}
      </main>

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
      `}</style>
    </div>
  );
};

export default FeedPage;