import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import PollCard from '../components/PollCard';
import EditProfileModal from '../components/EditProfileModal';
import CommentsModal from '../components/CommentsModal';
import { Settings, Users, Vote, Trophy, Heart, LogOut, ArrowLeft, AtSign, Bookmark } from 'lucide-react';
import { mockPolls, voteOnPoll, toggleLike } from '../services/mockData';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
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
  const [savedPolls, setSavedPolls] = useState([]);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [selectedPollTitle, setSelectedPollTitle] = useState('');
  const [selectedPollAuthor, setSelectedPollAuthor] = useState('');
  const { toast } = useToast();
  const { user: authUser, logout, refreshUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

  // Create a comprehensive user database from poll options AND poll authors
  const allUsers = [
    // Users from poll options
    ...mockPolls.flatMap(poll => 
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
    ),
    // Users from poll authors
    ...mockPolls
      .filter(poll => poll.authorUser) // Only polls with authorUser data
      .map(poll => ({
        id: poll.authorUser.username,
        username: poll.authorUser.username,
        displayName: poll.authorUser.displayName,
        avatar: poll.authorUser.avatar,
        verified: poll.authorUser.verified,
        followers: parseInt(poll.authorUser.followers.replace(/[KM]/g, match => match === 'K' ? '000' : '000000')) || Math.floor(Math.random() * 50000) + 10000,
        following: Math.floor(Math.random() * 2000) + 200,
        totalVotes: Math.floor(Math.random() * 500) + 100,
        pollsCreated: Math.floor(Math.random() * 100) + 15,
        bio: `🏆 Creador de encuestas | 🎯 ${poll.authorUser.displayName} | 📍 Madrid`,
        location: 'Madrid, España',
        joinDate: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long' 
        }),
      }))
  ];

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

  // Initialize saved polls (mock data)
  useEffect(() => {
    // In real app, this would be fetched from backend
    const mockSavedPolls = polls.filter((poll, index) => index % 3 === 0); // Every 3rd poll as example
    setSavedPolls(mockSavedPolls);
  }, [polls]);

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
    displayName: authUser?.display_name || authUser?.username || 'Mi Perfil',
    email: authUser?.email || 'user@example.com',
    bio: '🎯 Creando votaciones épicas | 📊 Fan de las estadísticas | 🚀 Siempre innovando',
    avatar: authUser?.avatar_url || null,
    followers: 1234,
    following: 567,
    totalVotes: 89,
    pollsCreated: 23,
    totalPolls: mockPolls.length,
    verified: authUser?.is_verified || false
  } : viewedUser || {
    id: 'default_user',
    username: 'usuario',
    displayName: 'Usuario',
    email: 'usuario@example.com',
    bio: 'Perfil de usuario',
    avatar: null,
    followers: 0,
    following: 0,
    totalVotes: 0,
    pollsCreated: 0,
    totalPolls: 0,
    verified: false
  };

  // Add null safety check to prevent charAt errors
  if (!displayUser || (!displayUser.displayName && !displayUser.username)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

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
  
  // Mock mentions - polls where user is mentioned in options
  const mentionedPolls = polls.filter(poll => 
    poll.options.some(option => 
      option.user?.username === displayUser.username || 
      option.user?.displayName === displayUser.displayName
    )
  );
  

  
  // Function to toggle save status
  const handleSave = (pollId) => {
    const isSaved = savedPolls.some(poll => poll.id === pollId);
    if (isSaved) {
      setSavedPolls(savedPolls.filter(poll => poll.id !== pollId));
      toast({
        title: "Publicación eliminada",
        description: "La publicación ha sido removida de guardados",
      });
    } else {
      const pollToSave = polls.find(poll => poll.id === pollId);
      if (pollToSave) {
        setSavedPolls([...savedPolls, pollToSave]);
        toast({
          title: "¡Publicación guardada!",
          description: "La publicación ha sido guardada exitosamente",
        });
      }
    }
  };

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

  const handleProfileUpdate = async () => {
    // Refresh user data after profile update
    await refreshUser();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {!isOwnProfile && (
                <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <h1 className="text-xl font-bold text-gray-900">
                {isOwnProfile ? 'Mi Perfil' : `@${displayUser.username}`}
              </h1>
            </div>
            {isOwnProfile && (
              <Button variant="ghost" size="sm" className="hover:bg-gray-100" onClick={handleSettingsClick}>
                <Settings className="w-5 h-5" />
              </Button>
            )}
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
                    {((displayUser?.displayName || displayUser?.username || 'U') + '').charAt(0).toUpperCase()}
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
                  {/* Removed level badge */}
                </div>
                
                <p className="text-white/90 max-w-md">{displayUser.bio}</p>
                

              </div>

              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => setEditProfileModalOpen(true)}
                    >
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
                  </>
                ) : (
                  <>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Users className="w-4 h-4 mr-2" />
                      Seguir
                    </Button>
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Heart className="w-4 h-4 mr-2" />
                      Me gusta
                    </Button>
                  </>
                )}
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

        {/* Progress Bar - Removed gamification stats */}

        {/* Content Tabs */}
        <Tabs defaultValue="polls" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="polls" className="flex items-center gap-2">
              <Vote className="w-4 h-4" />
              Votaciones
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Me Gusta
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex items-center gap-2">
              <AtSign className="w-4 h-4" />
              Menciones
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Guardados
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
                      onSave={handleSave}
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
                      onSave={handleSave}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mentions" className="space-y-6">
            {mentionedPolls.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AtSign className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No tienes menciones</h3>
                <p className="text-gray-600 mb-6">Las publicaciones donde seas mencionado aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <AtSign className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mentionedPolls.length} menciones encontradas
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mentionedPolls.map((poll) => (
                    <div key={poll.id} className="animate-fade-in">
                      <div className="relative">
                        <PollCard
                          poll={poll}
                          onVote={handleVote}
                          onLike={handleLike}
                          onShare={handleShare}
                          onComment={handleComment}
                          onSave={handleSave}
                        />
                        {/* Mention badge */}
                        <div className="absolute top-2 right-2 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                          <AtSign className="w-3 h-3" />
                          Mencionado
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            {savedPolls.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No tienes publicaciones guardadas</h3>
                <p className="text-gray-600 mb-6">Guarda las votaciones interesantes para verlas más tarde</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {savedPolls.length} publicaciones guardadas
                    </h3>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSavedPolls([]);
                      toast({
                        title: "Guardados limpiados",
                        description: "Todas las publicaciones guardadas han sido eliminadas",
                      });
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Limpiar todo
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedPolls.map((poll) => (
                    <div key={poll.id} className="animate-fade-in">
                      <div className="relative group">
                        <PollCard
                          poll={poll}
                          onVote={handleVote}
                          onLike={handleLike}
                          onShare={handleShare}
                          onComment={handleComment}
                          onSave={handleSave}
                        />
                        {/* Saved badge with remove option */}
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                            <Bookmark className="w-3 h-3" />
                            Guardado
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 bg-red-100 hover:bg-red-200 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSave(poll.id);
                            }}
                          >
                            <span className="text-xs">✕</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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