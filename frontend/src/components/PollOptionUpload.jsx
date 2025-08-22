/**
 * PollOptionUpload - Component for uploading images/videos to poll options
 */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Image as ImageIcon, 
  Video, 
  X, 
  Loader2, 
  Upload,
  Play,
  Pause
} from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import uploadService from '../services/uploadService';
import { cn } from '../lib/utils';

const PollOptionUpload = ({
  onMediaSelect = () => {},
  onMediaRemove = () => {},
  currentMedia = null,
  optionText = '',
  className = '',
  disabled = false,
  compact = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!file || disabled) return;

    // Validate file
    const validation = uploadService.validateFile(file, {
      maxSize: 20 * 1024 * 1024, // 20MB for poll options
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
    });

    if (!validation.isValid) {
      toast({
        title: "Archivo no válido",
        description: validation.errors.join('. '),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadService.uploadFile(
        file,
        'poll_option',
        (progress) => {
          console.log(`Upload progress: ${progress}%`);
        }
      );

      // Create media object with URL and metadata
      const mediaObject = {
        id: result.id,
        type: result.file_type, // 'image' or 'video'
        url: uploadService.getPublicUrl(result.public_url),
        originalName: result.original_filename,
        size: result.file_size,
        width: result.width,
        height: result.height,
        duration: result.duration,
        uploadResult: result
      };

      onMediaSelect(mediaObject);

      toast({
        title: "Archivo subido",
        description: `${file.name} se subió exitosamente`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      toast({
        title: "Error al subir archivo",
        description: error.message || "No se pudo subir el archivo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle file input
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = ''; // Reset input
  };

  // Remove current media
  const handleRemoveMedia = () => {
    if (currentMedia) {
      onMediaRemove(currentMedia);
      setVideoPlaying(false);
    }
  };

  // Toggle video play/pause
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying(!videoPlaying);
    }
  };

  // Get file icon
  const getFileTypeIcon = () => {
    if (currentMedia?.type === 'video') {
      return <Video className="w-5 h-5" />;
    }
    return <ImageIcon className="w-5 h-5" />;
  };

  if (compact) {
    // Compact version for inline use
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {currentMedia ? (
          <div className="flex items-center gap-2">
            {/* Media preview */}
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              {currentMedia.type === 'image' ? (
                <img 
                  src={currentMedia.url} 
                  alt="Option media"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Remove button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemoveMedia}
              disabled={disabled || isUploading}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="h-8"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {currentMedia ? (
        // Media Preview
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="relative rounded-lg overflow-hidden bg-gray-900">
            {currentMedia.type === 'image' ? (
              <img 
                src={currentMedia.url} 
                alt={optionText || "Poll option media"}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="relative w-full h-48">
                <video
                  ref={videoRef}
                  src={currentMedia.url}
                  className="w-full h-full object-cover"
                  onPlay={() => setVideoPlaying(true)}
                  onPause={() => setVideoPlaying(false)}
                  onEnded={() => setVideoPlaying(false)}
                >
                  Tu navegador no soporta videos.
                </video>

                {/* Video play/pause button */}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={toggleVideoPlay}
                  className="absolute bottom-3 left-3 h-8 w-8 p-0 bg-black bg-opacity-50 hover:bg-opacity-70"
                >
                  {videoPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </Button>
              </div>
            )}

            {/* Media info overlay */}
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {getFileTypeIcon()}
                <span>{uploadService.formatFileSize(currentMedia.size)}</span>
              </div>
            </div>

            {/* Remove button */}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRemoveMedia}
              disabled={disabled}
              className="absolute top-3 right-3 h-8 w-8 p-0 bg-black bg-opacity-50 hover:bg-opacity-70"
            >
              <X className="w-4 h-4 text-white" />
            </Button>

            {/* Loading overlay */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"
                >
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        // Upload Area
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer",
            dragOver 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: dragOver ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {isUploading ? (
                <Loader2 className="mx-auto w-10 h-10 text-blue-500 animate-spin mb-3" />
              ) : (
                <Upload className={cn(
                  "mx-auto w-10 h-10 mb-3",
                  dragOver ? "text-blue-500" : "text-gray-400"
                )} />
              )}
            </motion.div>
            
            <p className="text-sm font-medium text-gray-700 mb-1">
              {isUploading ? 'Subiendo...' : 'Agregar imagen o video'}
            </p>
            
            <p className="text-xs text-gray-500">
              Arrastra aquí o haz clic para seleccionar
            </p>
          </div>

          {/* Drag overlay */}
          <AnimatePresence>
            {dragOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center"
              >
                <div className="text-blue-600 text-sm font-semibold">
                  Suelta el archivo aquí
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default PollOptionUpload;