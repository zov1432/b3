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
import { Plus, X, Sparkles, Upload, Image, Video, Play, Music } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { fileToBase64 } from '../services/mockData';
import MusicSelector from './MusicSelector';

const MediaUploadPreview = ({ media, onRemove, isVideo = false }) => {
  if (!media) return null;

  return (
    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
      {isVideo ? (
        <div className="relative w-full h-full">
          <img 
            src={media.thumbnail} 
            alt="Video preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Play className="w-8 h-8 text-white" />
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
        className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
      >
        <X className="w-3 h-3" />
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
        music: selectedMusic, // Incluir música seleccionada
        options: validOptions.map(opt => ({
          text: opt.text.trim(),
          media: opt.media
        }))
      });

      toast({
        title: "¡Votación creada!",
        description: selectedMusic 
          ? `Tu votación ha sido publicada con "${selectedMusic.title}"` 
          : "Tu votación ha sido publicada exitosamente",
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <DialogHeader className="border-b border-gray-100 pb-6">
          <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Crear Nueva Votación
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-2">
            Crea una pregunta interesante y agrega imágenes o videos para cada opción.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          {/* Título */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-lg font-semibold text-gray-900">
              ¿Cuál es tu pregunta?
            </Label>
            <Textarea
              id="title"
              placeholder="Ej: ¿Quién ganó el mejor outfit de hoy?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-[100px] resize-none border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl text-base p-4 bg-gray-50/50"
            />
          </div>

          {/* Selector de Música Simplificado - Estilo TikTok */}
          {selectedMusic ? (
            /* Música seleccionada - Mostrar de forma compacta */
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                  <img 
                    src={selectedMusic.cover} 
                    alt={selectedMusic.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <Music className="w-3 h-3 text-gray-900" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-base text-gray-900">{selectedMusic.title}</p>
                  <p className="text-sm text-gray-600">{selectedMusic.artist}</p>
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
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            /* Botón para agregar música - Estilo simple */
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMusicSelector(!showMusicSelector)}
              className="w-full h-14 border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-colors rounded-xl"
            >
              <Music className="w-6 h-6 mr-3" />
              <span className="text-base font-medium">Agregar música</span>
            </Button>
          )}

          {/* Selector de música expandido */}
          {showMusicSelector && !selectedMusic && (
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
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

          {/* Opciones con Media */}
          <div className="space-y-6">
            <Label className="text-lg font-semibold text-gray-900">
              Opciones para votar
            </Label>
            {options.map((option, index) => (
              <div key={index} className="bg-gray-50/50 border border-gray-200 rounded-xl p-6 space-y-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    placeholder={`Descripción opción ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    className="flex-1 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg h-12 text-base bg-white"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="hover:bg-red-100 hover:text-red-600 rounded-lg w-10 h-10"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                {/* Media Upload/Preview */}
                <div className="space-y-3">
                  {option.media ? (
                    <MediaUploadPreview 
                      media={option.media}
                      isVideo={option.media.type === 'video'}
                      onRemove={() => updateOption(index, 'media', null)}
                    />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                      <div className="space-y-4">
                        <div className="flex justify-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Image className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Video className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-base font-medium text-gray-900 mb-1">
                            Sube una imagen o video
                          </p>
                          <p className="text-sm text-gray-600">
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
                            <Button type="button" variant="outline" size="default" className="text-blue-600 border-blue-300 hover:bg-blue-50 rounded-lg h-11 px-6">
                              <Upload className="w-5 h-5 mr-2" />
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
                className="w-full h-14 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl text-base font-medium"
              >
                <Plus className="w-5 h-5 mr-3" />
                Agregar otra opción
              </Button>
            )}
          </div>
        </form>

        <DialogFooter className="border-t border-gray-100 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isCreating}
            className="h-12 px-6 text-base font-medium rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-8 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isCreating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Creando votación...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Crear Votación
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePollModal;