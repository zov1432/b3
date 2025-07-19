export const mockPolls = [
  {
    id: '1',
    title: '¿Cuál es el mejor logo de Nike?',
    author: 'Noviago',
    timeAgo: 'hace 2 semanas',
    options: [
      { id: 'a', text: 'Swoosh simple', votes: 2 },
      { id: 'b', text: 'Nike clásico', votes: 93 },
      { id: 'c', text: 'Adidas (broma)', votes: 3 },
      { id: 'd', text: 'X marca', votes: 2 }
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
    title: '¿Quién ganó el outfit de hoy?',
    author: 'FashionVoter',
    timeAgo: 'hace 1 hora',
    options: [
      { id: 'a', text: 'Laura - Vestido rosa', votes: 45 },
      { id: 'b', text: 'Sethi - Look casual', votes: 32 },
      { id: 'c', text: 'Micaela - Estilo elegante', votes: 18 },
      { id: 'd', text: 'Natalia - Outfit bohemio', votes: 5 }
    ],
    totalVotes: 100,
    likes: 2300,
    shares: 450,
    comments: 89,
    userVote: null,
    userLiked: false
  },
  {
    id: '3',
    title: '¿Cuál es la mejor serie de Netflix 2025?',
    author: 'SeriesMania',
    timeAgo: 'hace 3 días',
    options: [
      { id: 'a', text: 'Stranger Things 5', votes: 40 },
      { id: 'b', text: 'Wednesday Temporada 2', votes: 35 },
      { id: 'c', text: 'The Witcher 4', votes: 15 },
      { id: 'd', text: 'Casa de Papel Spin-off', votes: 10 }
    ],
    totalVotes: 100,
    likes: 12500,
    shares: 3200,
    comments: 540,
    userVote: null,
    userLiked: false
  }
];

export const mockComments = {
  '1': [
    {
      id: '1',
      author: 'JuanCarlos',
      text: 'Obviamente el Nike clásico, es icónico',
      timeAgo: 'hace 2 horas',
      likes: 45
    },
    {
      id: '2',
      author: 'MariaFernandez',
      text: '¿En serio pusieron Adidas? 😂',
      timeAgo: 'hace 1 día',
      likes: 23
    }
  ],
  '2': [
    {
      id: '3',
      author: 'FashionLover',
      text: 'Laura siempre con los mejores outfits ✨',
      timeAgo: 'hace 30 min',
      likes: 12
    }
  ],
  '3': [
    {
      id: '4',
      author: 'NetflixFan',
      text: 'Stranger Things nunca decepciona',
      timeAgo: 'hace 1 día',
      likes: 67
    }
  ]
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
  const newPoll = {
    id: Date.now().toString(),
    title: pollData.title,
    author: 'Usuario', // En la implementación real sería el usuario logueado
    timeAgo: 'hace unos momentos',
    options: pollData.options.map((text, index) => ({
      id: String.fromCharCode(97 + index), // a, b, c, d
      text,
      votes: 0
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