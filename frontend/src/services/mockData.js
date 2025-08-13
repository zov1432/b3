export const mockPolls = [
  {
    id: '1',
    title: '¿Quién ganó el mejor outfit de hoy?',
    author: 'Noviago',
    timeAgo: 'hace 2 semanas',
    music: {
      id: 'music_1',
      title: 'Style & Fashion',
      artist: 'Fashion Beats',
      duration: 30,
      url: '/music/style-fashion.mp3', // Mock URL
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
      isOriginal: false,
      waveform: [0.2, 0.5, 0.8, 0.3, 0.7, 0.9, 0.4, 0.6, 0.8, 0.2, 0.5, 0.7, 0.9, 0.3, 0.6, 0.8, 0.4, 0.7, 0.5, 0.9]
    },
    options: [
      { 
        id: 'a', 
        user: {
          username: 'Laura_Style',
          displayName: 'Laura',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b8c5?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '125K'
        },
        text: 'Vestido rosa elegante', 
        votes: 45,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1591567462127-1f25099900ab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb3V0Zml0fGVufDB8fHx8MTc1NTA2NTIwN3ww&ixlib=rb-4.1.0&q=85'
        }
      },
      { 
        id: 'b', 
        user: {
          username: 'sethi_fashion',
          displayName: 'Sethi',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          verified: false,
          followers: '89K'
        },
        text: 'Look casual chic', 
        votes: 32,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwb3V0Zml0fGVufDB8fHx8MTc1NTA2NTIwN3ww&ixlib=rb-4.1.0&q=85'
        }
      },
      { 
        id: 'c', 
        user: {
          username: 'micaela_boho',
          displayName: 'Micaela',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          verified: false,
          followers: '56K'
        },
        text: 'Estilo bohemio', 
        votes: 18,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxvdXRmaXQlMjBjb21wYXJpc29ufGVufDB8fHx8MTc1NTA2NTIxM3ww&ixlib=rb-4.1.0&q=85'
        }
      },
      { 
        id: 'd', 
        user: {
          username: 'natalia_vintage',
          displayName: 'Natalia',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '234K'
        },
        text: 'Outfit vintage', 
        votes: 5,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1601679249486-3e2a903f23ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxvdXRmaXQlMjBjb21wYXJpc29ufGVufDB8fHx8MTc1NTA2NTIxM3ww&ixlib=rb-4.1.0&q=85'
        }
      }
    ],
    totalVotes: 100,
    likes: 651000,
    shares: 10000,
    comments: 10000,
    userVote: null,
    userLiked: false
  },
  {
    id: '2',
    title: '¿Cuál es la mejor receta de cocina?',
    author: 'ChefMaster',
    timeAgo: 'hace 1 hora',
    music: {
      id: 'music_2',
      title: 'Cooking Vibes',
      artist: 'Kitchen Beats',
      duration: 45,
      url: '/music/cooking-vibes.mp3',
      cover: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
      isOriginal: true,
      waveform: [0.3, 0.7, 0.4, 0.8, 0.5, 0.9, 0.2, 0.6, 0.8, 0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.6, 0.4, 0.7, 0.9, 0.2]
    },
    options: [
      { 
        id: 'a', 
        user: {
          username: 'healthy_chef',
          displayName: 'Carlos',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '456K'
        },
        text: 'Tostada de aguacate y huevo', 
        votes: 45,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxmb29kfGVufDB8fHx8MTc1NTA2NTI0NXww&ixlib=rb-4.1.0&q=85'
        }
      },
      { 
        id: 'b', 
        user: {
          username: 'bowl_master',
          displayName: 'Alex',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '789K'
        },
        text: 'Bowl colorido saludable', 
        votes: 32,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxmb29kfGVufDB8fHx8MTc1NTA2NTI0NXww&ixlib=rb-4.1.0&q=85'
        }
      }
    ],
    totalVotes: 77,
    likes: 2300,
    shares: 450,
    comments: 89,
    userVote: null,
    userLiked: false
  },
  {
    id: '3',
    title: '¿Mejor estilo de vida?',
    author: 'LifestyleGuru',
    timeAgo: 'hace 3 días',
    music: {
      id: 'music_3',
      title: 'Zen Vibes',
      artist: 'Wellness Beats',
      duration: 60,
      url: '/music/zen-vibes.mp3',
      cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
      isOriginal: false,
      waveform: [0.1, 0.9, 0.3, 0.8, 0.6, 0.4, 0.9, 0.2, 0.7, 0.5, 0.8, 0.3, 0.6, 0.9, 0.4, 0.7, 0.2, 0.8, 0.5, 0.9]
    },
    options: [
      { 
        id: 'a', 
        user: {
          username: 'yoga_master',
          displayName: 'Maya',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '342K'
        },
        text: 'Yoga y meditación', 
        votes: 65,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGV8ZW58MHx8fHwxNzU1MDY1MjUxfDA&ixlib=rb-4.1.0&q=85'
        }
      },
      { 
        id: 'b', 
        user: {
          username: 'coffee_lover',
          displayName: 'Sofia',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          verified: false,
          followers: '156K'
        },
        text: 'Café y rutina matutina', 
        votes: 43,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxsaWZlc3R5bGV8ZW58MHx8fHwxNzU1MDY1MjUxfDA&ixlib=rb-4.1.0&q=85'
        }
      }
    ],
    totalVotes: 108,
    likes: 5670,
    shares: 234,
    comments: 145,
    userVote: null,
    userLiked: false
  },
  {
    id: '4',
    title: '¿Mejor setup de trabajo?',
    author: 'TechReviewer',
    timeAgo: 'hace 1 día',
    music: {
      id: 'music_4',
      title: 'Focus Mode',
      artist: 'Productivity Sounds',
      duration: 40,
      url: '/music/focus-mode.mp3',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center',
      isOriginal: true,
      waveform: [0.4, 0.6, 0.8, 0.5, 0.7, 0.3, 0.9, 0.4, 0.6, 0.8, 0.2, 0.7, 0.5, 0.9, 0.3, 0.8, 0.6, 0.4, 0.7, 0.5]
    },
    options: [
      { 
        id: 'a', 
        user: {
          username: 'dev_workspace',
          displayName: 'Miguel',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '678K'
        },
        text: 'Setup de programación', 
        votes: 78,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHx0ZWNobm9sb2d5fGVufDB8fHx8MTc1NTA2NTI1Nnww&ixlib=rb-4.1.0&q=85'
        }
      },
      { 
        id: 'b', 
        user: {
          username: 'creative_space',
          displayName: 'Andrea',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b8c5?w=400&h=400&fit=crop&crop=face',
          verified: false,
          followers: '234K'
        },
        text: 'Escritorio moderno', 
        votes: 52,
        media: {
          type: 'image',
          url: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'
        }
      }
    ],
    totalVotes: 130,
    likes: 3456,
    shares: 567,
    comments: 78,
    userVote: null,
    userLiked: false
  },
  {
    id: '5',
    title: '¿Mejor plan para el fin de semana?',
    author: 'WeekendVibes',
    timeAgo: 'hace 5 horas',
    music: {
      id: 'music_5',
      title: 'Weekend Party',
      artist: 'Weekend DJ',
      duration: 35,
      url: '/music/weekend-party.mp3',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
      isOriginal: false,
      waveform: [0.5, 0.8, 0.3, 0.9, 0.6, 0.4, 0.7, 0.8, 0.2, 0.9, 0.5, 0.7, 0.4, 0.8, 0.6, 0.3, 0.9, 0.5, 0.7, 0.8]
    },
    options: [
      { 
        id: 'a', 
        user: {
          username: 'social_butterfly',
          displayName: 'Lucia',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '445K'
        },
        text: 'Reunión con amigos', 
        votes: 89,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxsaWZlc3R5bGV8ZW58MHx8fHwxNzU1MDY1MjUxfDA&ixlib=rb-4.1.0&q=85'
        }
      },
      { 
        id: 'b', 
        user: {
          username: 'homebody_life',
          displayName: 'Emma',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          verified: false,
          followers: '178K'
        },
        text: 'Día tranquilo en casa', 
        votes: 67,
        media: {
          type: 'image',
          url: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg'
        }
      }
    ],
    totalVotes: 156,
    likes: 4567,
    shares: 234,
    comments: 123,
    userVote: null,
    userLiked: false
  }
];

export const mockComments = {
  '1': [
    {
      id: '1',
      author: 'JuanCarlos',
      text: '¡Laura siempre con los mejores outfits! 💖',
      timeAgo: 'hace 2 horas',
      likes: 45
    },
    {
      id: '2',
      author: 'MariaFernandez',
      text: 'Sethi también se ve increíble 😍',
      timeAgo: 'hace 1 día',
      likes: 23
    }
  ],
  '2': [
    {
      id: '3',
      author: 'FoodLover',
      text: 'La pizza italiana es insuperable 🍕',
      timeAgo: 'hace 30 min',
      likes: 12
    }
  ],
  '3': [
    {
      id: '4',
      author: 'LifestyleFan',
      text: 'Yoga es vida 🧘‍♀️',
      timeAgo: 'hace 1 día',
      likes: 67
    }
  ]
};

// Función para convertir archivo a base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Función para simular votación
export const voteOnPoll = (pollId, optionId) => {
  const poll = mockPolls.find(p => p.id === pollId);
  if (poll && !poll.userVote) {
    poll.userVote = optionId;
    poll.options.find(o => o.id === optionId).votes++;
    poll.totalVotes++;
    return true;
  }
  return false;
};

// Función para simular like
export const toggleLike = (pollId) => {
  const poll = mockPolls.find(p => p.id === pollId);
  if (poll) {
    if (poll.userLiked) {
      poll.likes--;
      poll.userLiked = false;
    } else {
      poll.likes++;
      poll.userLiked = true;
    }
    return poll.userLiked;
  }
  return false;
};

// Función para crear nueva votación
export const createPoll = (pollData) => {
  // Usuarios de ejemplo para nuevas votaciones
  const sampleUsers = [
    {
      username: 'user_one',
      displayName: 'Usuario 1',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b8c5?w=400&h=400&fit=crop&crop=face',
      verified: false,
      followers: Math.floor(Math.random() * 100) + 'K'
    },
    {
      username: 'user_two',
      displayName: 'Usuario 2',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      verified: Math.random() > 0.7,
      followers: Math.floor(Math.random() * 200) + 'K'
    },
    {
      username: 'user_three',
      displayName: 'Usuario 3',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      verified: Math.random() > 0.8,
      followers: Math.floor(Math.random() * 150) + 'K'
    },
    {
      username: 'user_four',
      displayName: 'Usuario 4',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      verified: false,
      followers: Math.floor(Math.random() * 80) + 'K'
    }
  ];

  const newPoll = {
    id: Date.now().toString(),
    title: pollData.title,
    author: 'Usuario', // En la implementación real sería el usuario logueado
    timeAgo: 'hace unos momentos',
    music: pollData.music || null, // Incluir música si está disponible
    options: pollData.options.map((option, index) => ({
      id: String.fromCharCode(97 + index), // a, b, c, d
      user: sampleUsers[index] || sampleUsers[0], // Usar usuarios de ejemplo
      text: option.text,
      votes: 0,
      media: option.media
    })),
    totalVotes: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    userVote: null,
    userLiked: false
  };
  
  mockPolls.unshift(newPoll);
  return newPoll;
};