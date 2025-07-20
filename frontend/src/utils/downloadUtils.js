// Utilidades para generar y descargar contenido de las encuestas
export const generatePollImage = async (poll) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas
    canvas.width = 400;
    canvas.height = 600;
    
    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Logo/Título de la app
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('VotaTok', canvas.width / 2, 40);
    
    // Título de la encuesta
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#ffffff';
    const titleLines = wrapText(ctx, poll.title, canvas.width - 40);
    titleLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 80 + (index * 25));
    });
    
    // Autor y fecha
    ctx.font = '14px Arial';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`Por ${poll.author} • ${poll.timeAgo}`, canvas.width / 2, 150);
    
    // Música (si existe)
    if (poll.music) {
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`♪ ${poll.music.title} - ${poll.music.artist}`, canvas.width / 2, 180);
    }
    
    // Opciones de la encuesta
    const optionsStartY = poll.music ? 220 : 200;
    poll.options.forEach((option, index) => {
      const y = optionsStartY + (index * 80);
      const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
      
      // Fondo de la opción
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(20, y - 30, canvas.width - 40, 60);
      
      // Barra de progreso
      if (percentage > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        const progressWidth = ((canvas.width - 40) * percentage) / 100;
        ctx.fillRect(20, y - 30, progressWidth, 60);
      }
      
      // Letra de la opción
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(String.fromCharCode(65 + index), 35, y - 5);
      
      // Texto de la opción
      ctx.font = '14px Arial';
      const optionLines = wrapText(ctx, option.text, canvas.width - 120);
      optionLines.forEach((line, lineIndex) => {
        ctx.fillText(line, 60, y - 5 + (lineIndex * 18));
      });
      
      // Usuario de la opción
      ctx.font = '12px Arial';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`@${option.user.username}`, 60, y + 15);
      
      // Porcentaje
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.fillText(`${percentage}%`, canvas.width - 35, y - 5);
    });
    
    // Estadísticas
    const statsY = optionsStartY + (poll.options.length * 80) + 30;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${poll.totalVotes} votos • ${poll.likes} likes • ${poll.comments} comentarios`,
      canvas.width / 2,
      statsY
    );
    
    // QR o enlace (simulado)
    ctx.font = '10px Arial';
    ctx.fillText('Escanea para votar en VotaTok', canvas.width / 2, canvas.height - 20);
    
    // Convertir canvas a blob
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png', 1);
  });
};

// Función para envolver texto
const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
};

// Función para descargar imagen
export const downloadPollImage = async (poll, filename = null) => {
  try {
    const blob = await generatePollImage(poll);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename || `votatok-${poll.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading poll image:', error);
    return false;
  }
};

// Función para compartir encuesta
export const sharePoll = async (poll) => {
  try {
    const blob = await generatePollImage(poll);
    const file = new File([blob], `votatok-${poll.id}.png`, { type: 'image/png' });
    
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `VotaTok - ${poll.title}`,
        text: `¡Vota en esta encuesta! ${poll.title}`,
        files: [file]
      });
      return true;
    } else if (navigator.clipboard && navigator.clipboard.write) {
      // Copiar imagen al portapapeles
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      return 'clipboard';
    } else {
      // Fallback: descargar imagen
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `votatok-${poll.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
      return 'download';
    }
  } catch (error) {
    console.error('Error sharing poll:', error);
    return false;
  }
};

// Función para generar datos JSON de la encuesta
export const generatePollData = (poll) => {
  const pollData = {
    id: poll.id,
    title: poll.title,
    author: poll.author,
    timeAgo: poll.timeAgo,
    music: poll.music ? {
      title: poll.music.title,
      artist: poll.music.artist,
      category: poll.music.category
    } : null,
    options: poll.options.map(option => ({
      text: option.text,
      user: {
        username: option.user.username,
        displayName: option.user.displayName,
        verified: option.user.verified
      },
      votes: option.votes,
      percentage: poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0
    })),
    stats: {
      totalVotes: poll.totalVotes,
      likes: poll.likes,
      comments: poll.comments,
      shares: poll.shares
    },
    exportedAt: new Date().toISOString(),
    exportedFrom: 'VotaTok'
  };
  
  return pollData;
};

// Función para descargar datos JSON
export const downloadPollData = (poll, filename = null) => {
  try {
    const pollData = generatePollData(poll);
    const dataStr = JSON.stringify(pollData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename || `votatok-data-${poll.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading poll data:', error);
    return false;
  }
};

// Función para detectar si es móvil
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Función para detectar capacidades del dispositivo
export const getDeviceCapabilities = () => {
  return {
    canShare: 'share' in navigator,
    canClipboard: 'clipboard' in navigator && 'write' in navigator.clipboard,
    canDownload: true,
    isMobile: isMobile(),
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    hasTouch: 'ontouchstart' in window
  };
};