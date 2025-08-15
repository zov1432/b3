import React from 'react';
import { Compass, Clock, Sparkles } from 'lucide-react';

const ExplorePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animated icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Compass className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
          </div>
        </div>

        {/* Main message */}
        <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
          Próximamente
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-6">
          Estamos preparando algo increíble para ti
        </p>
        
        {/* Description */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <Clock className="w-6 h-6 text-blue-400 mx-auto mb-3" />
          <p className="text-gray-200 leading-relaxed">
            La página de exploración llegará muy pronto con nuevas funcionalidades y contenido personalizado.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;