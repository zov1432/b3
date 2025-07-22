import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import PollCard from '../components/PollCard';
import { Settings, MapPin, Calendar, Users, Vote, Trophy, Heart, LogOut } from 'lucide-react';
import { mockPolls, voteOnPoll, toggleLike } from '../services/mockData';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { useAddiction } from '../contexts/AddictionContext';
import { cn } from '../lib/utils';

const StatCard = ({ icon: Icon, label, value, color = "blue" }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          color === "blue" && "bg-blue-100 text-blue-600",
          color === "green" && "bg-green-100 text-green-600",
          color === "purple" && "bg-purple-100 text-purple-600",
          color === "red" && "bg-red-100 text-red-600"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("polls");
  const [polls, setPolls] = useState(mockPolls);
  const { toast } = useToast();

  // Mock user data
  const user = {
    id: '1',
    username: 'usuario_actual',
    displayName: 'Mi Perfil',
    bio: '🎯 Creando votaciones épicas | 📊 Fan de las estadísticas | 🚀 Siempre innovando',
    location: 'Madrid, España',
    joinDate: 'Marzo 2024',
    avatar: 'https://github.com/shadcn.png',
    followers: 1234,
    following: 567,
    totalPolls: mockPolls.length,
    totalVotes: 15420,
    verified: true
  };

  // Filter user's polls (in real app, this would be filtered by user ID)
  const userPolls = polls.filter(poll => poll.author === 'Noviago' || poll.id === '1');
  const likedPolls = polls.filter(poll => poll.userLiked);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Perfil</h1>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <Card className="mb-6 overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-white/20">
                  <AvatarImage src={user.avatar} alt={user.displayName} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    {user.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {user.verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{user.displayName}</h2>
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    @{user.username}
                  </Badge>
                </div>
                
                <p className="text-white/90 max-w-md">{user.bio}</p>
                
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Se unió en {user.joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Editar Perfil
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Compartir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Users}
            label="Seguidores"
            value={user.followers.toLocaleString()}
            color="blue"
          />
          <StatCard
            icon={Vote}
            label="Votaciones"
            value={user.totalPolls}
            color="green"
          />
          <StatCard
            icon={Trophy}
            label="Votos totales"
            value={user.totalVotes.toLocaleString()}
            color="purple"
          />
          <StatCard
            icon={Heart}
            label="Siguiendo"
            value={user.following}
            color="red"
          />
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="polls" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="polls" className="flex items-center gap-2">
              <Vote className="w-4 h-4" />
              Mis Votaciones
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Me Gusta
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Actividad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="polls" className="space-y-6">
            {userPolls.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Vote className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No has creado votaciones</h3>
                <p className="text-gray-600 mb-6">¡Crea tu primera votación para empezar a obtener votos!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userPolls.map((poll) => (
                  <div key={poll.id} className="animate-fade-in">
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
          </TabsContent>

          <TabsContent value="liked" className="space-y-6">
            {likedPolls.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No tienes votaciones favoritas</h3>
                <p className="text-gray-600 mb-6">¡Dale like a las votaciones que más te gusten!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {likedPolls.map((poll) => (
                  <div key={poll.id} className="animate-fade-in">
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
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Actividad Reciente</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Vote className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Creaste una nueva votación</p>
                      <p className="text-xs text-gray-500">hace 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Tu votación alcanzó 100 votos</p>
                      <p className="text-xs text-gray-500">hace 1 día</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Tienes 10 nuevos seguidores</p>
                      <p className="text-xs text-gray-500">hace 3 días</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;