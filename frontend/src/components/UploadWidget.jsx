/**
 * UploadWidget - Reusable drag & drop file upload component
 */
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Image, 
  Video, 
  File, 
  Check, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import uploadService from '../services/uploadService';
import { cn } from '../lib/utils';

const UploadWidget = ({
  onUploadComplete = () => {},
  onUploadError = () => {},
  uploadType = 'general',
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
  className = '',
  disabled = false,
  showPreview = true,
  dragText = 'Arrastra archivos aquí o',
  buttonText = 'Seleccionar archivos',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // Handle drag events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [disabled]);

  // Handle file selection
  const handleFiles = useCallback((newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    // Limit number of files
    const filesToProcess = newFiles.slice(0, maxFiles);
    
    // Validate each file
    const validFiles = [];
    const invalidFiles = [];

    filesToProcess.forEach(file => {
      const validation = uploadService.validateFile(file, { maxSize, allowedTypes });
      if (validation.isValid) {
        validFiles.push({
          file,
          id: Math.random().toString(36).substring(7),
          preview: null,
          progress: 0,
          status: 'pending', // pending, uploading, complete, error
          error: null
        });
      } else {
        invalidFiles.push({ file, errors: validation.errors });
      }
    });

    // Show errors for invalid files
    invalidFiles.forEach(({ file, errors }) => {
      toast({
        title: `Error con ${file.name}`,
        description: errors.join('. '),
        variant: "destructive",
      });
    });

    if (validFiles.length > 0) {
      // Generate previews for valid files
      validFiles.forEach(fileObj => {
        if (fileObj.file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFiles(prev => prev.map(f => 
              f.id === fileObj.id 
                ? { ...f, preview: e.target.result }
                : f
            ));
          };
          reader.readAsDataURL(fileObj.file);
        } else if (fileObj.file.type.startsWith('video/')) {
          // For videos, we'll generate a thumbnail later
          fileObj.preview = null;
        }
      });

      setFiles(prev => [...prev, ...validFiles]);
    }
  }, [maxFiles, maxSize, allowedTypes, toast]);

  // Handle file input change
  const handleFileInputChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);

  // Upload files
  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = pendingFiles.map(async (fileObj) => {
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'uploading' }
            : f
        ));

        try {
          const result = await uploadService.uploadFile(
            fileObj.file,
            uploadType,
            (progress) => {
              setFiles(prev => prev.map(f => 
                f.id === fileObj.id 
                  ? { ...f, progress }
                  : f
              ));
            }
          );

          // Update status to complete
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'complete', uploadResult: result }
              : f
          ));

          // Call success callback
          onUploadComplete(result, fileObj.file);

          return result;
        } catch (error) {
          // Update status to error
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'error', error: error.message }
              : f
          ));

          // Call error callback
          onUploadError(error, fileObj.file);
          
          throw error;
        }
      });

      await Promise.allSettled(uploadPromises);

      toast({
        title: "Upload completado",
        description: `${pendingFiles.length} archivo(s) procesado(s)`,
      });

    } finally {
      setUploading(false);
    }
  };

  // Remove file from list
  const removeFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  // Get icon for file type
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="w-8 h-8 text-purple-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'uploading': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200",
          isDragging 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
          files.length > 0 && "mb-4"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Upload Icon & Text */}
        <div className="text-center">
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className={cn(
              "mx-auto w-12 h-12 mb-4",
              isDragging ? "text-blue-500" : "text-gray-400"
            )} />
          </motion.div>
          
          <p className="text-lg font-medium text-gray-700 mb-2">
            {dragText}
          </p>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
          >
            {buttonText}
          </Button>
          
          <p className="text-sm text-gray-500 mt-2">
            Máximo {uploadService.formatFileSize(maxSize)} por archivo
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={allowedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center"
            >
              <div className="text-blue-600 text-xl font-semibold">
                Suelta aquí los archivos
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {/* Actions */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {files.length} archivo(s) seleccionado(s)
              </p>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearFiles}
                  disabled={uploading}
                >
                  Limpiar
                </Button>
                
                <Button
                  size="sm"
                  onClick={uploadFiles}
                  disabled={uploading || files.every(f => f.status !== 'pending')}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    'Subir archivos'
                  )}
                </Button>
              </div>
            </div>

            {/* File items */}
            {files.map((fileObj) => (
              <motion.div
                key={fileObj.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                {/* File preview or icon */}
                <div className="flex-shrink-0 mr-3">
                  {showPreview && fileObj.preview ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                      <img 
                        src={fileObj.preview} 
                        alt={fileObj.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      {getFileIcon(fileObj.file)}
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {uploadService.formatFileSize(fileObj.file.size)}
                  </p>
                  
                  {/* Progress bar */}
                  {fileObj.status === 'uploading' && (
                    <div className="mt-1">
                      <div className="bg-gray-200 rounded-full h-1.5">
                        <motion.div
                          className="bg-blue-500 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${fileObj.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {fileObj.progress}%
                      </p>
                    </div>
                  )}

                  {/* Error message */}
                  {fileObj.status === 'error' && (
                    <p className="text-xs text-red-500 mt-1">
                      {fileObj.error}
                    </p>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex-shrink-0 ml-3 flex items-center gap-2">
                  {/* Status icon */}
                  {fileObj.status === 'complete' && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  {fileObj.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  {fileObj.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  )}

                  {/* Remove button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(fileObj.id)}
                    disabled={fileObj.status === 'uploading'}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadWidget;