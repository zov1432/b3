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
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjZmY5NWE1Ii8+ICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iMzAiIGZpbGw9IiNmZmM5YzYiLz4gIDxyZWN0IHg9IjcwIiB5PSIxMTAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2ZmNjk5NiIvPiAgPHRleHQgeD0iMTAwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiI+TGF1cmE8L3RleHQ+PC9zdmc+'
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
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjMzMzIi8+ICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iMzAiIGZpbGw9IiNmZmM5YzYiLz4gIDxyZWN0IHg9IjYwIiB5PSIxMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2RkZCIvPiAgPHJlY3QgeD0iNzAiIHk9IjE3MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjMDAwIi8+ICA8dGV4dCB4PSIxMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIj5TZXROPC90ZXh0Pjwvc3ZnPg=='
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
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjZjQ5N2E4Ii8+ICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iMzAiIGZpbGw9IiNmZmM5YzYiLz4gIDxyZWN0IHg9IjUwIiB5PSIxMTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjBhNWJkIi8+ICA8dGV4dCB4PSIxMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIj5NaWNhZWxhPC90ZXh0Pjwvc3ZnPg=='
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
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjYWQ4Yjc0Ii8+ICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iMzAiIGZpbGw9IiNmZmM5YzYiLz4gIDxyZWN0IHg9IjYwIiB5PSIxMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI5MCIgZmlsbD0iI2RlYzNhNSIvPiAgPHRleHQgeD0iMTAwIiB5PSIyMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiI+TmF0YWxpYTwvdGV4dD48L3N2Zz4='
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
          username: 'italian_chef',
          displayName: 'Marco Rossi',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '456K'
        },
        text: 'Pizza casera italiana', 
        votes: 45,
        media: {
          type: 'image',
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjZmZkNzAwIi8+ICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iNjAiIGZpbGw9IiNmZmFhMDAiLz4gIDxjaXJjbGUgY3g9IjgwIiBjeT0iNjAiIHI9IjgiIGZpbGw9IiNmZjAwMDAiLz4gIDxjaXJjbGUgY3g9IjEyMCIgY3k9IjEwMCIgcj0iNiIgZmlsbD0iIzAwZjAwMCIvPiAgPHRleHQgeD0iMTAwIiB5PSIxNDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzMzMyI+UGl6emEgSXRhbGlhbmE8L3RleHQ+PC9zdmc+'
        }
      },
      { 
        id: 'b', 
        user: {
          username: 'sushi_master',
          displayName: 'Hiroshi',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '789K'
        },
        text: 'Sushi tradicional', 
        votes: 32,
        media: {
          type: 'image',
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjZjBmMGYwIi8+ICA8cmVjdCB4PSI0MCIgeT0iNjAiIHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmZmYiLz4gIDxyZWN0IHg9IjQwIiB5PSI1NSIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI1IiBmaWxsPSIjZmYwMDAwIi8+ICA8cmVjdCB4PSI0MCIgeT0iMTAwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUiIGZpbGw9IiMwMGZmMDAiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMTM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzMzMiPlN1c2hpPC90ZXh0Pjwvc3ZnPg=='
        }
      },
      { 
        id: 'c', 
        user: {
          username: 'mexican_foodie',
          displayName: 'Carlos',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          verified: false,
          followers: '123K'
        },
        text: 'Tacos mexicanos', 
        votes: 18,
        media: {
          type: 'image',
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjZmZkMjAwIi8+ICA8ZWxsaXBzZSBjeD0iMTAwIiBjeT0iODAiIHJ4PSI3MCIgcnk9IjMwIiBmaWxsPSIjZmZhYTAwIi8+ICA8cmVjdCB4PSI3MCIgeT0iNzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmYwMDAwIi8+ICA8cmVjdCB4PSI3NSIgeT0iODUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDBmZjAwIi8+ICA8dGV4dCB4PSIxMDAiIHk9IjEzNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMzMzIj5UYWNvcyBNZXhpY2Fub3M8L3RleHQ+PC9zdmc+'
        }
      },
      { 
        id: 'd', 
        user: {
          username: 'burger_king_chef',
          displayName: 'Alex',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
          verified: false,
          followers: '67K'
        },
        text: 'Hamburguesa gourmet', 
        votes: 5,
        media: {
          type: 'image',
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjODc2NTQzIi8+ICA8ZWxsaXBzZSBjeD0iMTAwIiBjeT0iNjAiIHJ4PSI2MCIgcnk9IjE1IiBmaWxsPSIjZGVjM2E1Ii8+ICA8cmVjdCB4PSI1MCIgeT0iNzAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIGZpbGw9IiM2NjQyMjgiLz4gIDxyZWN0IHg9IjUwIiB5PSI4NSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDBmZjAwIi8+ICA8ZWxsaXBzZSBjeD0iMTAwIiBjeT0iMTAwIiByeD0iNjAiIHJ5PSIxNSIgZmlsbD0iI2RlYzNhNSIvPiAgPHRleHQgeD0iMTAwIiB5PSIxMzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiI+SGFtYnVyZ3Vlc2E8L3RleHQ+PC9zdmc+'
        }
      }
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
    title: '¿Cuál es el mejor baile de TikTok?',
    author: 'DanceMaster',
    timeAgo: 'hace 3 días',
    music: {
      id: 'music_3',
      title: 'Dance Revolution 2025',
      artist: 'DJ TikTok',
      duration: 60,
      url: '/music/dance-revolution.mp3',
      cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
      isOriginal: false,
      waveform: [0.1, 0.9, 0.3, 0.8, 0.6, 0.4, 0.9, 0.2, 0.7, 0.5, 0.8, 0.3, 0.6, 0.9, 0.4, 0.7, 0.2, 0.8, 0.5, 0.9]
    },
    options: [
      { 
        id: 'a', 
        user: {
          username: 'jalaiah_official',
          displayName: 'Jalaiah H.',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '2.1M'
        },
        text: 'Renegade Dance', 
        votes: 40,
        media: {
          type: 'video',
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMzMzIi8+ICA8cG9seWdvbiBwb2ludHM9IjgwLDYwIDgwLDEwMCAxMjAsMTAwIDEyMCw2MCIgZmlsbD0iI2ZmZiIvPiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTIwIiByPSIxMCIgZmlsbD0iI2ZmZiIvPiAgPHRleHQgeD0iMTAwIiB5PSIxNDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiI+UmVuZWdhZGU8L3RleHQ+PC9zdmc+',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjZmYwMDUwIi8+ICA8cG9seWdvbiBwb2ludHM9IjgwLDYwIDEyMCw4MCA4MCwxMDAiIGZpbGw9IiNmZmYiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMTM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiPlJlbmVnYWRlIERhbmNlPC90ZXh0Pjwvc3ZnPg=='
        }
      },
      { 
        id: 'b', 
        user: {
          username: 'keara_wilson',
          displayName: 'Keara',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '1.5M'
        },
        text: 'Savage Challenge', 
        votes: 35,
        media: {
          type: 'video',
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMzMzIi8+ICA8cG9seWdvbiBwb2ludHM9IjgwLDYwIDgwLDEwMCAxMjAsMTAwIDEyMCw2MCIgZmlsbD0iI2ZmZiIvPiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTIwIiByPSIxMCIgZmlsbD0iI2ZmZiIvPiAgPHRleHQgeD0iMTAwIiB5PSIxNDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiI+U2F2YWdlPC90ZXh0Pjwvc3ZnPg==',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjOGIwMGZmIi8+ICA8cG9seWdvbiBwb2ludHM9IjgwLDYwIDEyMCw4MCA4MCwxMDAiIGZpbGw9IiNmZmYiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMTM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiPlNhdmFnZSBDaGFsbGVuZ2U8L3RleHQ+PC9zdmc+'
        }
      },
      { 
        id: 'c', 
        user: {
          username: 'jakepaul_dance',
          displayName: 'Jake P.',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '3.2M'
        },
        text: 'WAP Dance', 
        votes: 15,
        media: {
          type: 'video',
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMzMzIi8+ICA8cG9seWdvbiBwb2ludHM9IjgwLDYwIDgwLDEwMCAxMjAsMTAwIDEyMCw2MCIgZmlsbD0iI2ZmZiIvPiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTIwIiByPSIxMCIgZmlsbD0iI2ZmZiIvPiAgPHRleHQgeD0iMTAwIiB5PSIxNDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiI+V0FQPC90ZXh0Pjwvc3ZnPg==',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjZmY2YjAwIi8+ICA8cG9seWdvbiBwb2ludHM9IjgwLDYwIDEyMCw4MCA4MCwxMDAiIGZpbGw9IiNmZmYiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMTM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiPldBUCBEYW5jZTwvdGV4dD48L3N2Zz4='
        }
      },
      { 
        id: 'd', 
        user: {
          username: 'nia_sioux',
          displayName: 'Nia S.',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b8c5?w=400&h=400&fit=crop&crop=face',
          verified: true,
          followers: '876K'
        },
        text: 'Corvette Corvette', 
        votes: 10,
        media: {
          type: 'video',
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMzMzIi8+ICA8cG9seWdvbiBwb2ludHM9IjgwLDYwIDgwLDEwMCAxMjAsMTAwIDEyMCw2MCIgZmlsbD0iI2ZmZiIvPiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTIwIiByPSIxMCIgZmlsbD0iI2ZmZiIvPiAgPHRleHQgeD0iMTAwIiB5PSIxNDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiI+Q29ydmV0dGU8L3RleHQ+PC9zdmc+',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMDBmZmZmIi8+ICA8cG9seWdvbiBwb2ludHM9IjgwLDYwIDEyMCw4MCA4MCwxMDAiIGZpbGw9IiNmZmYiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMTM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiPkNvcnZldHRlIENvcnZldHRlPC90ZXh0Pjwvc3ZnPg=='
        }
      }
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
      author: 'DanceKing',
      text: 'Renegade nunca pasa de moda 🔥',
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