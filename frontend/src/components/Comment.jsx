import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, MoreHorizontal, Edit3, Trash2, 
  ChevronDown, ChevronUp, Reply, Flag, CheckCircle 
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

const CommentForm = ({ 
  onSubmit, 
  onCancel, 
  placeholder = "Escribe un comentario...", 
  initialValue = "",
  isReply = false,
  isEditing = false 
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <motion.form 
      className={cn(
        "space-y-3 p-3 rounded-lg border bg-white/95 backdrop-blur-sm",
        isReply ? "ml-8 border-blue-200" : "border-gray-200"
      )}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={isReply ? 2 : 3}
        maxLength={500}
        autoFocus
      />
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {content.length}/500 caracteres • Ctrl+Enter para enviar
        </span>
        
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </Button>
          )}
          
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? 'Enviando...' : isEditing ? 'Guardar' : 'Comentar'}
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

const Comment = ({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  onLike, 
  depth = 0, 
  maxDepth = 3 
}) => {
  const { user: currentUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isAuthor = currentUser && currentUser.id === comment.user.id;
  const canReply = depth < maxDepth;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike(comment.id);
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async (content) => {
    try {
      await onReply(comment.id, content);
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error replying:', error);
      throw error;
    }
  };

  const handleEdit = async (content) => {
    try {
      await onEdit(comment.id, content);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.')) {
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'ahora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return date.toLocaleDateString('es', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      className={cn(
        "comment-thread",
        depth > 0 && "ml-6 pl-4 border-l-2 border-gray-100"
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
    >
      <div className="comment-item bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        {/* Header del comentario */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={comment.user.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
              {((comment.user.display_name || comment.user.username || 'U') + '').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 text-sm">
                {comment.user.display_name || comment.user.username}
              </span>
              
              {comment.user.is_verified && (
                <CheckCircle className="w-3 h-3 text-blue-500 fill-current" />
              )}
              
              <span className="text-xs text-gray-500">
                {formatTimeAgo(comment.created_at)}
              </span>
              
              {comment.is_edited && (
                <span className="text-xs text-gray-400">(editado)</span>
              )}
            </div>
            
            {/* Contenido del comentario */}
            {showEditForm ? (
              <CommentForm
                onSubmit={handleEdit}
                onCancel={() => setShowEditForm(false)}
                placeholder="Editar comentario..."
                initialValue={comment.content}
                isEditing={true}
              />
            ) : (
              <p className="text-gray-800 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>
          
          {/* Menú de acciones */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            
            {showMenu && (
              <motion.div 
                className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {isAuthor && (
                  <>
                    <button
                      onClick={() => {
                        setShowEditForm(true);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit3 className="w-3 h-3" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Eliminar
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Flag className="w-3 h-3" />
                  Reportar
                </button>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Acciones del comentario */}
        <div className="flex items-center gap-4 text-sm">
          <motion.button
            onClick={handleLike}
            disabled={isLiking}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors",
              comment.user_liked 
                ? "text-red-600 bg-red-50 hover:bg-red-100" 
                : "text-gray-600 hover:text-red-600 hover:bg-red-50"
            )}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className={cn(
              "w-4 h-4 transition-all",
              comment.user_liked && "fill-current"
            )} />
            {comment.likes > 0 && (
              <span className="font-medium">{comment.likes}</span>
            )}
          </motion.button>
          
          {canReply && (
            <motion.button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Reply className="w-4 h-4" />
              Responder
            </motion.button>
          )}
          
          {hasReplies && (
            <motion.button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {showReplies ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {comment.reply_count} {comment.reply_count === 1 ? 'respuesta' : 'respuestas'}
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Formulario de respuesta */}
      <AnimatePresence>
        {showReplyForm && (
          <div className="mt-3">
            <CommentForm
              onSubmit={handleReply}
              onCancel={() => setShowReplyForm(false)}
              placeholder={`Responder a ${comment.user.display_name || comment.user.username}...`}
              isReply={true}
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Respuestas anidadas */}
      <AnimatePresence>
        {showReplies && hasReplies && (
          <motion.div 
            className="replies-container mt-4 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {comment.replies.map((reply, index) => (
              <Comment
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onLike={onLike}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay para cerrar menú al hacer click fuera */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
};

export default Comment;