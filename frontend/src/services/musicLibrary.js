// Librería de música disponible para las publicaciones
export const musicLibrary = [
  {
    id: 'music_1',
    title: 'Style & Fashion',
    artist: 'Fashion Beats',
    duration: 30,
    url: '/music/style-fashion.mp3',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    category: 'Moda',
    isOriginal: false,
    waveform: [0.2, 0.5, 0.8, 0.3, 0.7, 0.9, 0.4, 0.6, 0.8, 0.2, 0.5, 0.7, 0.9, 0.3, 0.6, 0.8, 0.4, 0.7, 0.5, 0.9]
  },
  {
    id: 'music_2',
    title: 'Cooking Vibes',
    artist: 'Kitchen Beats',
    duration: 45,
    url: '/music/cooking-vibes.mp3',
    cover: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
    category: 'Comida',
    isOriginal: true,
    waveform: [0.3, 0.7, 0.4, 0.8, 0.5, 0.9, 0.2, 0.6, 0.8, 0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.6, 0.4, 0.7, 0.9, 0.2]
  },
  {
    id: 'music_3',
    title: 'Dance Revolution 2025',
    artist: 'DJ TikTok',
    duration: 60,
    url: '/music/dance-revolution.mp3',
    cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
    category: 'Baile',
    isOriginal: false,
    waveform: [0.1, 0.9, 0.3, 0.8, 0.6, 0.4, 0.9, 0.2, 0.7, 0.5, 0.8, 0.3, 0.6, 0.9, 0.4, 0.7, 0.2, 0.8, 0.5, 0.9]
  },
  {
    id: 'music_4',
    title: 'Summer Vibes',
    artist: 'Chill Master',
    duration: 38,
    url: '/music/summer-vibes.mp3',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
    category: 'Chill',
    isOriginal: false,
    waveform: [0.4, 0.6, 0.3, 0.7, 0.5, 0.8, 0.3, 0.6, 0.9, 0.2, 0.5, 0.7, 0.4, 0.8, 0.6, 0.3, 0.7, 0.5, 0.8, 0.4]
  },
  {
    id: 'music_5',
    title: 'Urban Beat',
    artist: 'City Sounds',
    duration: 52,
    url: '/music/urban-beat.mp3',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop&crop=center',
    category: 'Hip Hop',
    isOriginal: false,
    waveform: [0.6, 0.8, 0.4, 0.9, 0.3, 0.7, 0.5, 0.8, 0.2, 0.6, 0.9, 0.4, 0.7, 0.3, 0.8, 0.5, 0.9, 0.2, 0.6, 0.7]
  },
  {
    id: 'music_6',
    title: 'Acoustic Dream',
    artist: 'Folk Vibes',
    duration: 42,
    url: '/music/acoustic-dream.mp3',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    category: 'Acústico',
    isOriginal: true,
    waveform: [0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.3, 0.5]
  },
  {
    id: 'music_7',
    title: 'Electronic Pulse',
    artist: 'Synth Wave',
    duration: 48,
    url: '/music/electronic-pulse.mp3',
    cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
    category: 'Electrónica',
    isOriginal: false,
    waveform: [0.8, 0.3, 0.9, 0.2, 0.7, 0.5, 0.8, 0.4, 0.9, 0.1, 0.6, 0.8, 0.3, 0.9, 0.2, 0.7, 0.5, 0.8, 0.4, 0.9]
  },
  {
    id: 'music_8',
    title: 'Pop Sensation',
    artist: 'Chart Toppers',
    duration: 35,
    url: '/music/pop-sensation.mp3',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    category: 'Pop',
    isOriginal: false,
    waveform: [0.5, 0.7, 0.4, 0.8, 0.3, 0.6, 0.9, 0.2, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9, 0.3, 0.7, 0.5, 0.8, 0.2, 0.6]
  }
];

export const musicCategories = [
  'Todas',
  'Moda',
  'Comida', 
  'Baile',
  'Chill',
  'Hip Hop',
  'Acústico',
  'Electrónica',
  'Pop'
];

// Función para obtener música por categoría
export const getMusicByCategory = (category) => {
  if (category === 'Todas') {
    return musicLibrary;
  }
  return musicLibrary.filter(music => music.category === category);
};

// Función para buscar música por título o artista
export const searchMusic = (query) => {
  if (!query.trim()) {
    return musicLibrary;
  }
  
  const searchTerm = query.toLowerCase();
  return musicLibrary.filter(music => 
    music.title.toLowerCase().includes(searchTerm) ||
    music.artist.toLowerCase().includes(searchTerm)
  );
};

// Función para obtener música recomendada basada en el contenido del poll
export const getRecommendedMusic = (pollTitle) => {
  const title = pollTitle.toLowerCase();
  
  // Recomendaciones basadas en palabras clave
  if (title.includes('outfit') || title.includes('moda') || title.includes('vestido')) {
    return getMusicByCategory('Moda');
  }
  
  if (title.includes('comida') || title.includes('receta') || title.includes('cocina')) {
    return getMusicByCategory('Comida');
  }
  
  if (title.includes('baile') || title.includes('dance') || title.includes('tiktok')) {
    return getMusicByCategory('Baile');
  }
  
  // Devolver música popular por defecto
  return musicLibrary.slice(0, 4);
};

// Función para formatear duración
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};