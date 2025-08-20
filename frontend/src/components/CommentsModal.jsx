import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Sparkles } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        />
        
        {/* Modal */}
        <motion.div
          ref={modalRef}
          className="relative w-full max-w-2xl max-h-[92vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, scale: 0.85, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 60 }}
          transition={{ 
            type: "spring", 
            stiffness: 380, 
            damping: 25,
            duration: 0.4 
          }}
        >
          {/* Header con gradiente moderno */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-b border-gray-200/60 px-6 py-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent line-clamp-1">
                    {pollTitle}
                  </h2>
                  {pollAuthor && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      por <span className="font-medium text-indigo-600">{pollAuthor}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </div>
          
          {/* Contenido */}
          <div className="flex flex-col h-full max-h-[calc(92vh-100px)] overflow-hidden">
            <CommentSection
              pollId={pollId}
              isVisible={isOpen}
              maxHeight="100%"
              showHeader={false}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommentsModal;