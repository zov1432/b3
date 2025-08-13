import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import PollCard from '../components/PollCard';
import { ProgressBar } from '../components/AddictionUI';
import { Settings, MapPin, Calendar, Users, Vote, Trophy, Heart, LogOut, ArrowLeft } from 'lucide-react';
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
  const [viewedUser, setViewedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user: authUser, logout } = useAuth();
  const { userProfile, level, xp, streak, userAchievements, getXpToNextLevel, getXpProgress } = useAddiction();
  const { userId } = useParams();
  const navigate = useNavigate();

  // Create a simple user database from poll options
  const allUsers = mockPolls.flatMap(poll => 
    poll.options.map(option => ({
      id: option.user.username, // Use username as ID
      username: option.user.username,
      displayName: option.user.displayName,
      avatar: option.user.avatar,
      verified: option.user.verified,
      followers: parseInt(option.user.followers.replace('K', '000')) || Math.floor(Math.random() * 50000) + 10000,
      following: Math.floor(Math.random() * 1000) + 100,
      totalVotes: Math.floor(Math.random() * 200) + 50,
      pollsCreated: Math.floor(Math.random() * 50) + 5,
      bio: `✨ Creador de contenido | 🎯 ${option.user.displayName} | 📍 Madrid`,
      location: 'Madrid, España',
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      }),
    }))
  );

  // Remove duplicates by username
  const uniqueUsers = allUsers.filter((user, index, self) => 
    index === self.findIndex((u) => u.username === user.username)
  );

  // Function to get user by ID/username
  const getUserById = (id) => {
    return uniqueUsers.find(user => user.username === id || user.id === id);
  };

  // Load user data when userId changes
  useEffect(() => {
    if (userId) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const user = getUserById(userId);
        if (user) {
          setViewedUser(user);
        } else {
          toast({
            title: "Usuario no encontrado",
            description: "El perfil que buscas no existe",
            variant: "destructive"
          });
          navigate('/profile');
        }
        setLoading(false);
      }, 500);
    } else {
      setViewedUser(null);
      setLoading(false);
    }
  }, [userId, navigate, toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Determine which user to display
  const isOwnProfile = !userId || userId === authUser?.username;
  const displayUser = isOwnProfile ? {
    id: authUser?.id || '1',
    username: authUser?.username || 'usuario_actual',
    displayName: authUser?.display_name || 'Mi Perfil',
    email: authUser?.email || 'user@example.com',
    bio: '🎯 Creando votaciones épicas | 📊 Fan de las estadísticas | 🚀 Siempre innovando',
    location: 'Madrid, España',
    joinDate: new Date(authUser?.created_at || Date.now()).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    }),
    avatar: authUser?.avatar_url || null,
    followers: 1234,
    following: 567,
    totalVotes: userProfile?.total_votes || 89,
    pollsCreated: userProfile?.total_polls_created || 23,
    totalPolls: mockPolls.length,
    verified: authUser?.is_verified || false
  } : viewedUser || {};

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

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
                  <AvatarImage src={displayUser.avatar} alt={displayUser.displayName} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    {displayUser.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {displayUser.verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{displayUser.displayName}</h2>
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    @{displayUser.username}
                  </Badge>
                  {/* Level Badge */}
                  {level && (
                    <Badge variant="secondary" className="bg-gold/20 text-yellow-200 hover:bg-gold/30">
                      Nivel {level}
                    </Badge>
                  )}
                </div>
                
                <p className="text-white/90 max-w-md">{displayUser.bio}</p>
                
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{displayUser.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Se unió en {displayUser.joinDate}</span>
                  </div>
                  {streak && streak > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="font-bold">🔥 {streak}</span>
                      <span className="text-white/80">días</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Settings className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-red-500/20 border-red-500/30 text-white hover:bg-red-500/30"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
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
            value={displayUser.followers.toLocaleString()}
            color="blue"
          />
          <StatCard
            icon={Vote}
            label="Votaciones"
            value={displayUser.totalPolls}
            color="green"
          />
          <StatCard
            icon={Trophy}
            label="Votos totales"
            value={displayUser.totalVotes.toLocaleString()}
            color="purple"
          />
          <StatCard
            icon={Heart}
            label="Siguiendo"
            value={displayUser.following}
            color="red"
          />
        </div>

        {/* Progress Bar - Gamification Stats */}
        {userProfile && (
          <div className="mb-6">
            <ProgressBar
              level={level}
              xp={xp}
              xpToNext={getXpToNextLevel()}
              progress={getXpProgress()}
              streak={streak}
              className="shadow-lg"
            />
          </div>
        )}

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