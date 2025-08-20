import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Sparkles, Minus } from 'lucide-react';
import { Button } from './ui/button';
import CommentSection from './CommentSection';
import { cn } from '../lib/utils';

const CommentsModal = ({ 
  isOpen, 
  onClose, 
  pollId, 
  pollTitle = "Comentarios",
  pollAuthor = null 
}) => {
  const modalRef = useRef(null);

  // Manejar escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Click outside para cerrar
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        />
        
        {/* Modal - Desktop: Centro, Mobile: Bottom sheet */}
        <div className="flex items-center justify-center p-4 h-full md:items-center md:justify-center">
          <motion.div
            ref={modalRef}
            className={cn(
              "relative w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden",
              // Desktop styles
              "md:max-w-2xl md:max-h-[92vh]",
              // Mobile styles - bottom sheet
              "sm:max-w-full sm:h-[60vh] sm:fixed sm:bottom-0 sm:left-0 sm:right-0 sm:rounded-t-3xl sm:rounded-b-none sm:max-h-none"
            )}
            initial={{ 
              opacity: 0, 
              // Desktop: scale and y
              scale: 0.85, 
              y: 60,
              // Mobile: slide from bottom
              ...window.innerWidth < 768 && { 
                scale: 1, 
                y: "100%" 
              }
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.85, 
              y: window.innerWidth < 768 ? "100%" : 60 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 380, 
              damping: 25,
              duration: 0.4 
            }}
          >
            {/* Handle para móviles */}
            <div className="block sm:block md:hidden w-full p-3 flex justify-center">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header con diseño responsive */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-b border-gray-200/60 px-4 sm:px-6 py-3 sm:py-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent truncate">
                      {pollTitle}
                    </h2>
                    {pollAuthor && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">
                        por <span className="font-medium text-indigo-600">{pollAuthor}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </Button>
              </div>
            </div>
            
            {/* Contenido con altura responsive */}
            <div className="flex flex-col overflow-hidden h-full max-h-[calc(60vh-80px)] sm:max-h-[calc(60vh-100px)] md:max-h-[calc(92vh-100px)]">
              <CommentSection
                pollId={pollId}
                isVisible={isOpen}
                maxHeight="100%"
                showHeader={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CommentsModal;