import React from 'react';
import { X } from 'lucide-react';

const SimpleFOMOAlert = ({ 
  fomoContent, 
  onClose,
  onTakeAction,
  className = "" 
}) => {
  if (!fomoContent || fomoContent.length === 0) return null;

  const currentFOMO = fomoContent[0];

  const handleParticipate = () => {
    console.log('Participate button clicked!');
    alert('¡Participación exitosa!');
    onTakeAction && onTakeAction(currentFOMO);
  };

  const handleClose = () => {
    console.log('Close button clicked!');
    alert('Modal cerrado exitosamente!');
    onClose && onClose();
  };

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-[99999] ${className}`}>
      <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-2xl shadow-2xl border-2 border-white/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-full">
              <span className="text-white">⚠️</span>
            </div>
            <span className="text-white font-bold text-sm">
              🔥 URGENTE
            </span>
          </div>

          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer bg-red-500 hover:bg-red-600"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-white font-bold text-lg mb-2 leading-tight">
            {currentFOMO.title}
          </h3>

          <div className="flex items-center gap-4 mb-3">
            {/* Time left */}
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <span className="text-white font-bold text-sm">
                3h 29m restante
              </span>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <span className="text-white font-bold text-sm">
                472/1363
              </span>
            </div>

            {/* Trending */}
            <div className="flex items-center gap-1 bg-yellow-500/80 px-3 py-1 rounded-full">
              <span className="text-white font-bold text-sm">VIRAL</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleParticipate}
          className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm border border-white/30 cursor-pointer bg-green-500 hover:bg-green-600"
          type="button"
        >
          <span>¡Participar Ahora!</span>
          <span>⚡</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleFOMOAlert;