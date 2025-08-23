/**
 * Dynamic data service to replace hardcoded mockData
 * Provides configurable and realistic data generation
 */
import AppConfig from '../config/config';

class DynamicDataService {
  constructor() {
    this.userPool = [];
    this.mediaPool = [];
    this.musicPool = [];
    this.initializeDataPools();
  }

  /**
   * Initialize data pools with configurable content
   */
  initializeDataPools() {
    // Generate diverse user pool
    this.userPool = this.generateUserPool();
    
    // Generate media content pool
    this.mediaPool = this.generateMediaPool();
    
    // Generate music library
    this.musicPool = this.generateMusicPool();
  }

  /**
   * Generate realistic user profiles with configurable avatars
   */
  generateUserPool() {
    const usernames = [
      'tech_innovator', 'creative_soul', 'nature_lover', 'music_producer',
      'digital_artist', 'food_explorer', 'travel_addict', 'fitness_guru',
      'book_worm', 'gaming_pro', 'photo_enthusiast', 'startup_founder',
      'design_wizard', 'code_ninja', 'content_creator', 'social_butterfly'
    ];

    const displayNames = [
      'Alex Chen', 'Maria Rodriguez', 'David Kim', 'Sarah Johnson',
      'Carlos Martinez', 'Emma Thompson', 'Michael Brown', 'Lisa Wang',
      'James Wilson', 'Ana Garcia', 'Ryan Lee', 'Sophie Miller',
      'Marcus Davis', 'Isabella Lopez', 'Connor Moore', 'Zoe Anderson'
    ];

    const bios = [
      'Creating amazing content daily ✨',
      'Living life to the fullest 🌟',
      'Passionate about technology & innovation 🚀',
      'Artist, dreamer, creator 🎨',
      'Exploring the world one adventure at a time 🌍',
      'Music is my language 🎵',
      'Building the future, one code at a time 💻',
      'Fitness enthusiast & wellness advocate 💪',
      'Capturing moments, creating memories 📸',
      'Entrepreneur | Innovator | Dreamer 💡'
    ];

    return usernames.map((username, index) => ({
      id: `user_${index + 1}`,
      username,
      displayName: displayNames[index] || `User ${index + 1}`,
      avatar: this.generateAvatarUrl(index),
      bio: bios[index % bios.length],
      verified: Math.random() > 0.7,
      followers: this.generateFollowerCount(),
      isPublic: true,
      allowMessages: true
    }));
  }

  /**
   * Generate avatar URL with variety
   */
  generateAvatarUrl(index) {
    const avatarServices = [
      'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face',
      AppConfig.PLACEHOLDER_AVATAR
    ];
    
    return avatarServices[index % avatarServices.length];
  }

  /**
   * Generate realistic follower counts
   */
  generateFollowerCount() {
    const ranges = ['1.2K', '5.7K', '12.3K', '89.2K', '245K', '1.2M', '3.8M'];
    return ranges[Math.floor(Math.random() * ranges.length)];
  }

  /**
   * Generate media content pool
   */
  generateMediaPool() {
    const categories = [
      'technology', 'lifestyle', 'food', 'travel', 'fashion', 
      'fitness', 'gaming', 'music', 'art', 'education'
    ];

    return categories.flatMap(category => 
      Array.from({ length: 5 }, (_, index) => ({
        id: `${category}_${index}`,
        category,
        type: Math.random() > 0.3 ? 'image' : 'video',
        url: this.generateMediaUrl(category, index),
        thumbnail: this.generateThumbnailUrl(category, index),
        duration: Math.floor(Math.random() * 60) + 15, // 15-75 seconds
        quality: 'hd'
      }))
    );
  }

  /**
   * Generate media URLs with variety
   */
  generateMediaUrl(category, index) {
    const baseImages = [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=800&h=800&fit=crop',
      AppConfig.PLACEHOLDER_VIDEO
    ];
    
    return baseImages[index % baseImages.length];
  }

  /**
   * Generate thumbnail URLs
   */
  generateThumbnailUrl(category, index) {
    return `https://images.unsplash.com/photo-15${42000000000 + index}?w=400&h=400&fit=crop&crop=center`;
  }

  /**
   * Generate music library
   */
  generateMusicPool() {
    const tracks = [
      { title: 'Digital Waves', artist: 'Synth Master', genre: 'Electronic' },
      { title: 'Urban Nights', artist: 'City Beats', genre: 'Hip Hop' },
      { title: 'Ocean Dreams', artist: 'Ambient Flow', genre: 'Ambient' },
      { title: 'Neon Lights', artist: 'Future Sound', genre: 'Synthwave' },
      { title: 'Midnight Drive', artist: 'Retro Vibes', genre: 'Chillwave' },
      { title: 'Cosmic Journey', artist: 'Space Echo', genre: 'Ambient' },
      { title: 'Street Style', artist: 'Urban Pulse', genre: 'Hip Hop' }
    ];

    return tracks.map((track, index) => ({
      id: `music_${index + 1}`,
      ...track,
      duration: Math.floor(Math.random() * 120) + 30, // 30-150 seconds
      url: `/music/${track.title.toLowerCase().replace(/\s+/g, '-')}.mp3`,
      cover: `https://images.unsplash.com/photo-15${11000000000 + index}?w=400&h=400&fit=crop`,
      isOriginal: Math.random() > 0.5,
      waveform: Array.from({ length: 20 }, () => Math.random())
    }));
  }

  /**
   * Generate dynamic poll data
   */
  generatePoll(id, title, options = 4) {
    const poll = {
      id,
      title,
      author: this.getRandomUser(),
      authorUser: this.getRandomUser(),
      timeAgo: this.generateTimeAgo(),
      music: this.getRandomMusic(),
      options: this.generatePollOptions(options),
      category: this.getRandomCategory(),
      featured: Math.random() > 0.8,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Calculate totals
    poll.totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    poll.likes = Math.floor(poll.totalVotes * (0.1 + Math.random() * 0.4));
    poll.shares = Math.floor(poll.totalVotes * (0.02 + Math.random() * 0.08));
    poll.comments = Math.floor(poll.totalVotes * (0.05 + Math.random() * 0.15));

    return poll;
  }

  /**
   * Generate poll options with users and media
   */
  generatePollOptions(count) {
    const optionTexts = [
      'Amazing choice! 🔥', 'Love this option! ❤️', 'This is the way! ✨',
      'Perfect selection! 🎯', 'Absolutely yes! 👏', 'My favorite! 🌟',
      'Great pick! 💯', 'Totally agree! 🤝'
    ];

    return Array.from({ length: count }, (_, index) => ({
      id: String.fromCharCode(97 + index), // 'a', 'b', 'c', 'd'
      user: this.getRandomUser(),
      text: optionTexts[index % optionTexts.length],
      votes: Math.floor(Math.random() * 100) + 10,
      media: this.getRandomMedia()
    }));
  }

  /**
   * Utility methods
   */
  getRandomUser() {
    return this.userPool[Math.floor(Math.random() * this.userPool.length)];
  }

  getRandomMedia() {
    const media = this.mediaPool[Math.floor(Math.random() * this.mediaPool.length)];
    return {
      type: media.type,
      url: media.url,
      thumbnail: media.thumbnail,
      duration: media.duration
    };
  }

  getRandomMusic() {
    return this.musicPool[Math.floor(Math.random() * this.musicPool.length)];
  }

  getRandomCategory() {
    const categories = ['gaming', 'lifestyle', 'tech', 'food', 'travel', 'fashion', 'fitness'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  generateTimeAgo() {
    const minutes = Math.floor(Math.random() * 1440); // 0-24 hours
    if (minutes < 60) return `hace ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} horas`;
    return 'hace 1 día';
  }

  /**
   * Generate a complete feed of polls
   */
  generateFeed(count = AppConfig.DEFAULT_PAGE_SIZE) {
    const pollTitles = [
      '¿Cuál es tu setup de gaming favorito?',
      '¿Qué tendencia tech seguirás este año?',
      '¿Cuál es tu playlist para trabajar?',
      '¿Qué destino visitarías ahora?',
      '¿Cuál es tu rutina de ejercicio ideal?',
      '¿Qué app no puede faltar en tu teléfono?',
      '¿Cuál es tu comida comfort favorita?',
      '¿Qué serie estás viendo actualmente?'
    ];

    return Array.from({ length: count }, (_, index) => 
      this.generatePoll(
        `dynamic_poll_${index + 1}`,
        pollTitles[index % pollTitles.length]
      )
    );
  }

  /**
   * Generate user profile data
   */
  generateUserProfile(userId) {
    const user = this.userPool.find(u => u.id === userId) || this.getRandomUser();
    const userPolls = Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, index) =>
      this.generatePoll(`user_${userId}_poll_${index}`, `Poll from ${user.displayName}`)
    );

    return {
      ...user,
      polls: userPolls,
      stats: {
        pollsCreated: userPolls.length,
        totalVotes: userPolls.reduce((sum, poll) => sum + poll.totalVotes, 0),
        totalLikes: userPolls.reduce((sum, poll) => sum + poll.likes, 0),
        totalShares: userPolls.reduce((sum, poll) => sum + poll.shares, 0)
      }
    };
  }
}

// Export singleton instance
export const dynamicDataService = new DynamicDataService();
export default DynamicDataService;