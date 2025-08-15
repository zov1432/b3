import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import Comment from './Comment';

const CommentSection = ({ 
  pollId, 
  isVisible = true, 
  maxHeight = "600px",
  showHeader = true 
}) => {
  const { user, apiRequest } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Cargar comentarios
  const loadComments = async (pageNum = 0, append = false) => {
    if (!pollId || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest(`/api/polls/${pollId}/comments?limit=20&offset=${pageNum * 20}`);
      
      if (response.ok) {
        const newComments = await response.json();
        
        if (append) {
          setComments(prev => [...prev, ...newComments]);
        } else {
          setComments(newComments);
        }
        
        setHasMore(newComments.length === 20);
        setPage(pageNum);
      } else {
        throw new Error('Failed to load comments');
      }
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('Error al cargar comentarios. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar más comentarios
  const loadMoreComments = () => {
    if (!loading && hasMore) {
      loadComments(page + 1, true);
    }
  };

  // Crear nuevo comentario
  const handleCreateComment = async (content) => {
    if (!user || submitting) return;
    
    setSubmitting(true);
    try {
      const response = await apiRequest(`/api/polls/${pollId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          poll_id: pollId,
          content: content,
          parent_comment_id: null
        })
      });
      
      if (response.ok) {
        const newComment = await response.json();
        setComments(prev => [newComment, ...prev]);
        setShowNewCommentForm(false);
      } else {
        throw new Error('Failed to create comment');
      }
    } catch (err) {
      console.error('Error creating comment:', err);
      throw new Error('Error al enviar comentario');
    } finally {
      setSubmitting(false);
    }
  };

  // Responder a comentario
  const handleReplyToComment = async (parentCommentId, content) => {
    if (!user) return;
    
    try {
      const response = await apiRequest(`/api/polls/${pollId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          poll_id: pollId,
          content: content,
          parent_comment_id: parentCommentId
        })
      });
      
      if (response.ok) {
        // Recargar comentarios para mostrar la nueva respuesta
        loadComments(0, false);
      } else {
        throw new Error('Failed to reply to comment');
      }
    } catch (err) {
      console.error('Error replying to comment:', err);
      throw new Error('Error al responder comentario');
    }
  };

  // Editar comentario
  const handleEditComment = async (commentId, content) => {
    if (!user) return;
    
    try {
      const response = await apiRequest(`/api/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          content: content
        })
      });
      
      if (response.ok) {
        // Recargar comentarios para mostrar la edición
        loadComments(0, false);
      } else {
        throw new Error('Failed to edit comment');
      }
    } catch (err) {
      console.error('Error editing comment:', err);
      throw new Error('Error al editar comentario');
    }
  };

  // Eliminar comentario
  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    
    try {
      const response = await apiRequest(`/api/comments/${commentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Recargar comentarios para actualizar la vista
        loadComments(0, false);
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      throw new Error('Error al eliminar comentario');
    }
  };

  // Toggle like en comentario
  const handleLikeComment = async (commentId) => {
    if (!user) return;
    
    try {
      const response = await apiRequest(`/api/comments/${commentId}/like`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Actualizar el like localmente para UX inmediata
        setComments(prev => updateCommentLikeInTree(prev, commentId, result.liked, result.likes));
      } else {
        throw new Error('Failed to toggle like');
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Función auxiliar para actualizar likes en el árbol de comentarios
  const updateCommentLikeInTree = (comments, targetId, liked, likes) => {
    return comments.map(comment => {
      if (comment.id === targetId) {
        return { ...comment, user_liked: liked, likes };
      }
      
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentLikeInTree(comment.replies, targetId, liked, likes)
        };
      }
      
      return comment;
    });
  };

  // Cargar comentarios al montar el componente
  useEffect(() => {
    if (pollId && isVisible) {
      loadComments(0, false);
    }
  }, [pollId, isVisible]);

  // Formulario para nuevo comentario
  const NewCommentForm = () => (
    <motion.div
      className="new-comment-form p-4 bg-gray-50 border-b border-gray-200"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          const content = e.target.content.value.trim();
          if (!content) return;
          
          try {
            await handleCreateComment(content);
            e.target.reset();
          } catch (error) {
            // Error ya manejado en handleCreateComment
          }
        }}
        className="space-y-3"
      >
        <textarea
          name="content"
          placeholder="Escribe tu comentario..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          maxLength={500}
          required
        />
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Máximo 500 caracteres
          </span>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNewCommentForm(false)}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Comentar'
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );

  if (!pollId) {
    return null;
  }

  return (
    <motion.div 
      className="comment-section bg-white border border-gray-200 rounded-lg overflow-hidden"
      style={{ maxHeight }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      {showHeader && (
        <div className="comment-header p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">
                Comentarios {comments.length > 0 && `(${comments.length})`}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadComments(0, false)}
                disabled={loading}
                className="h-8"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </Button>
              
              {user && (
                <Button
                  size="sm"
                  onClick={() => setShowNewCommentForm(!showNewCommentForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {showNewCommentForm ? 'Cancelar' : 'Comentar'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Formulario de nuevo comentario */}
      <AnimatePresence>
        {showNewCommentForm && <NewCommentForm />}
      </AnimatePresence>
      
      {/* Lista de comentarios */}
      <div className="comment-list overflow-y-auto flex-1" style={{ maxHeight: `calc(${maxHeight} - 120px)` }}>
        {error && (
          <motion.div 
            className="error-message p-4 bg-red-50 border-b border-red-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadComments(0, false)}
                className="ml-2 h-6 text-red-700 hover:text-red-800"
              >
                Reintentar
              </Button>
            </div>
          </motion.div>
        )}
        
        {loading && comments.length === 0 ? (
          <div className="loading-state p-8 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Cargando comentarios...</span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="empty-state p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No hay comentarios aún</p>
            <p className="text-sm text-gray-400">¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <div className="comments-container p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {comments.map((comment, index) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onReply={handleReplyToComment}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  onLike={handleLikeComment}
                  depth={0}
                  maxDepth={3}
                />
              ))}
            </AnimatePresence>
            
            {/* Botón cargar más */}
            {hasMore && (
              <div className="load-more p-4 text-center border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadMoreComments}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    'Cargar más comentarios'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Aviso para usuarios no autenticados */}
      {!user && (
        <div className="auth-notice p-4 bg-yellow-50 border-t border-yellow-200">
          <p className="text-sm text-yellow-700 text-center">
            <a href="/login" className="font-semibold hover:underline">
              Inicia sesión
            </a> para comentar y participar en la conversación
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CommentSection;