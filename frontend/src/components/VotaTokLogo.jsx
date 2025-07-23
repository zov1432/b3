import React from 'react';

const VotaTokLogo = ({ size = 60, className = "" }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradientes principales */}
          <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF0050"/>
            <stop offset="50%" stopColor="#25F4EE"/>
            <stop offset="100%" stopColor="#FE2C55"/>
          </linearGradient>
          
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#F0F0F0"/>
          </linearGradient>

          {/* Filtros para efectos */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Fondo del logo con forma redondeada */}
        <rect 
          x="8" y="8" width="104" height="104" 
          rx="24" ry="24" 
          fill="url(#backgroundGradient)" 
          filter="url(#shadow)"
        />
        
        {/* Sombra interior para profundidad */}
        <rect 
          x="12" y="12" width="96" height="96" 
          rx="20" ry="20" 
          fill="rgba(255,255,255,0.1)" 
          opacity="0.8"
        />

        {/* Contenedor principal del icono */}
        <g transform="translate(60, 60)">
          
          {/* Símbolo de play/vote (triángulo estilo TikTok) */}
          <g transform="translate(-25, -15)">
            {/* Triángulo principal */}
            <path 
              d="M 0 -15 L 25 0 L 0 15 Z" 
              fill="url(#iconGradient)" 
              filter="url(#glow)"
            />
            
            {/* Líneas decorativas */}
            <path 
              d="M 30 -10 L 35 -10 M 30 0 L 40 0 M 30 10 L 35 10" 
              stroke="url(#iconGradient)" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </g>

          {/* Elementos de votación (checkmarks) */}
          <g transform="translate(15, -20)" opacity="0.9">
            {/* Check 1 */}
            <path 
              d="M 0 0 L 4 4 L 12 -4" 
              stroke="url(#iconGradient)" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none"
            />
          </g>
          
          <g transform="translate(10, 15)" opacity="0.7">
            {/* Check 2 */}
            <path 
              d="M 0 0 L 3 3 L 9 -3" 
              stroke="url(#iconGradient)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none"
            />
          </g>

          {/* Elementos decorativos (puntos trending) */}
          <circle cx="20" cy="-25" r="2" fill="rgba(255,255,255,0.8)" opacity="0.9"/>
          <circle cx="-30" cy="20" r="1.5" fill="rgba(255,255,255,0.6)" opacity="0.7"/>
          <circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.8)" opacity="0.8"/>

          {/* Texto integrado (V) */}
          <text 
            x="-35" y="5" 
            fontFamily="Arial, sans-serif" 
            fontSize="28" 
            fontWeight="bold" 
            fill="url(#iconGradient)" 
            opacity="0.3"
          >
            V
          </text>
        </g>

        {/* Brillo superior para efecto 3D */}
        <rect 
          x="12" y="12" width="96" height="30" 
          rx="20" ry="20" 
          fill="rgba(255,255,255,0.2)" 
          opacity="0.6"
        />
        
        {/* Borde sutil */}
        <rect 
          x="8" y="8" width="104" height="104" 
          rx="24" ry="24" 
          fill="none" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

// Logo simplificado para uso en navegación
export const VotaTokSimpleLogo = ({ size = 40, className = "" }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div 
        className="rounded-xl flex items-center justify-center text-white font-bold"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(45deg, #FF0050, #25F4EE, #FE2C55)',
          fontSize: size * 0.4
        }}
      >
        V
      </div>
    </div>
  );
};

// Logo con texto para headers
export const VotaTokLogoWithText = ({ size = 40, showText = true, className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <VotaTokSimpleLogo size={size} />
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
            VotaTok
          </span>
          <span className="text-xs text-gray-500 -mt-1">
            TikTok Style Polls
          </span>
        </div>
      )}
    </div>
  );
};

export default VotaTokLogo;