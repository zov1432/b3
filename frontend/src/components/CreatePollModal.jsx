import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, X, Sparkles, Upload, Image, Video, Play, Music, Send } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { fileToBase64 } from '../services/mockData';
import MusicSelector from './MusicSelector';
import PollOptionUpload from './PollOptionUpload';
import UploadWidget from './UploadWidget';

const MediaUploadPreview = ({ media, onRemove, isVideo = false }) => {
  if (!media) return null;

  return (
    <div className="relative w-full h-32 sm:h-48 rounded-2xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
      {isVideo ? (
        <div className="relative w-full h-full">
          <img 
            src={media.thumbnail} 
            alt="Video preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900 ml-1" />
            </div>
          </div>
        </div>
      ) : (
        <img 
          src={media.url} 
          alt="Preview"
          className="w-full h-full object-cover"
        />
      )}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 hover:text-red-500 transition-all duration-200 shadow-lg border border-gray-200"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

const CreatePollModal = ({ onCreatePoll, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([
    { text: '', media: null },
    { text: '', media: null }
  ]);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, { text: '', media: null }]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleFileUpload = async (index, file) => {
    try {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isImage && !isVideo) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos de imagen o video",
          variant: "destructive"
        });
        return;
      }

      const base64 = await fileToBase64(file);

      let mediaData = {
        type: isVideo ? 'video' : 'image',
        url: base64,
      };

      // Para videos, crear thumbnail básico
      if (isVideo) {
        mediaData.thumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMzMzIi8+ICA8cG9seWdvbiBwb2ludHM9IjgwLDYwIDEyMCw4MCA4MCwxMDAiIGZpbGw9IiNmZmYiLz4gIDx0ZXh0IHg9IjEwMCIgeT0iMTM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==';
      }

      updateOption(index, 'media', mediaData);

      toast({
        title: "¡Archivo cargado!",
        description: `${isVideo ? 'Video' : 'Imagen'} agregado exitosamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el archivo",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive"
      });
      return;
    }

    const validOptions = options.filter(opt => opt.text.trim() && opt.media);
    if (validOptions.length < 2) {
      toast({
        title: "Error", 
        description: "Necesitas al menos 2 opciones con texto y media",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    // Simular creación
    setTimeout(() => {
      onCreatePoll({
        title: title.trim(),
        music: selectedMusic,
        options: validOptions.map(opt => ({
          text: opt.text.trim(),
          media: opt.media
        }))
      });

      toast({
        title: "¡Contenido publicado!",
        description: selectedMusic 
          ? `Tu contenido ha sido publicado con "${selectedMusic.title}"` 
          : "Tu contenido ha sido publicado exitosamente",
      });

      // Reset form
      setTitle('');
      setOptions([
        { text: '', media: null },
        { text: '', media: null }
      ]);
      setSelectedMusic(null);
      setShowMusicSelector(false);
      setIsCreating(false);
      setIsOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[800px] h-[95vh] sm:h-auto max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl sm:rounded-2xl">
        <DialogHeader className="border-b border-gray-100 pb-4 sm:pb-8 px-2">
          <DialogTitle className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            Crear Contenido
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-lg mt-2 sm:mt-3 text-gray-600 font-medium">
            Comparte tu creatividad con el mundo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8 py-4 sm:py-8 px-2">
          {/* Título */}
          <div className="space-y-2 sm:space-y-4">
            <Label htmlFor="title" className="text-lg sm:text-xl font-bold text-gray-900">
              ¿Qué quieres preguntar?
            </Label>
            <Textarea
              id="title"
              placeholder="Escribe tu pregunta aquí... Sé creativo y haz que sea interesante para tu audiencia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-[100px] sm:min-h-[120px] resize-none border-2 border-gray-200 focus:ring-2 focus:ring-gray-400 focus:border-transparent rounded-2xl text-base sm:text-lg p-4 sm:p-6 bg-gray-50"
            />
          </div>

          {/* Selector de Música Elegante - Responsive */}
          {selectedMusic ? (
            <div className="flex items-center justify-between bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 sm:p-6 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                  <img 
                    src={selectedMusic.cover} 
                    alt={selectedMusic.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Music className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900" />
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm sm:text-lg text-gray-900 truncate">{selectedMusic.title}</p>
                  <p className="text-xs sm:text-base text-gray-600 truncate">{selectedMusic.artist}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedMusic(null);
                  setShowMusicSelector(false);
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 hover:text-red-500 hover:bg-white rounded-2xl shadow-sm border border-gray-200 flex-shrink-0 ml-2"
              >
                <X className="w-4 h-4 sm:w-6 sm:h-6" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMusicSelector(!showMusicSelector)}
              className="w-full h-12 sm:h-16 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all rounded-2xl"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-700 rounded-2xl flex items-center justify-center mr-2 sm:mr-4 shadow-sm">
                <Music className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-sm sm:text-lg font-semibold">Agregar música (opcional)</span>
            </Button>
          )}

          {/* Selector de música expandido */}
          {showMusicSelector && !selectedMusic && (
            <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <MusicSelector
                onSelectMusic={(music) => {
                  setSelectedMusic(music);
                  setShowMusicSelector(false);
                }}
                selectedMusic={selectedMusic}
                pollTitle={title}
              />
            </div>
          )}

          {/* Opciones con Media - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-8">
            <Label className="text-lg sm:text-xl font-bold text-gray-900">
              Opciones para votar
            </Label>
            {options.map((option, index) => (
              <div key={index} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 sm:p-8 space-y-4 sm:space-y-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-xl shadow-lg flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    placeholder={`Descripción para la opción ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    className="flex-1 border-2 border-gray-200 focus:ring-2 focus:ring-gray-400 focus:border-transparent rounded-2xl h-10 sm:h-14 text-sm sm:text-lg bg-white px-3 sm:px-6"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="w-10 h-10 sm:w-12 sm:h-12 hover:bg-white hover:text-red-500 rounded-2xl border border-gray-200 shadow-sm flex-shrink-0"
                    >
                      <X className="w-4 h-4 sm:w-6 sm:h-6" />
                    </Button>
                  )}
                </div>

                {/* Media Upload/Preview Mejorado - Mobile Optimized */}
                <div className="space-y-4">
                  {option.media ? (
                    <MediaUploadPreview 
                      media={option.media}
                      isVideo={option.media.type === 'video'}
                      onRemove={() => updateOption(index, 'media', null)}
                    />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 sm:p-10 text-center hover:border-gray-400 hover:bg-white transition-all duration-300">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex justify-center gap-2 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <Image className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <Video className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                            Sube una imagen o video
                          </p>
                          <p className="text-sm sm:text-base text-gray-600">
                            Arrastra el archivo aquí o haz clic para seleccionar
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) handleFileUpload(index, file);
                              }}
                              className="hidden"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="default" 
                              className="bg-white border-2 border-gray-300 hover:bg-gray-50 rounded-2xl h-10 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg font-semibold text-gray-700 shadow-sm"
                            >
                              <Upload className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                              Seleccionar Archivo
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {options.length < 4 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full h-12 sm:h-16 border-2 border-dashed border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-2xl text-sm sm:text-lg font-bold"
              >
                <Plus className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-4" />
                Agregar otra opción
              </Button>
            )}
          </div>
        </form>

        <DialogFooter className="border-t border-gray-100 pt-4 sm:pt-8 px-2 gap-2 sm:gap-4 flex-col sm:flex-row space-y-2 sm:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isCreating}
            className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-2xl border-2 border-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating}
            className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isCreating ? (
              <>
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-4" />
                Publicando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-4" />
                Publicar contenido
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePollModal;