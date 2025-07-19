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
import { Plus, X, Sparkles, Upload, Image, Video, Play } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { fileToBase64 } from '../services/mockData';

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
        options: validOptions.map(opt => ({
          text: opt.text.trim(),
          media: opt.media
        }))
      });

      toast({
        title: "¡Votación creada!",
        description: "Tu votación ha sido publicada exitosamente",
      });

      // Reset form
      setTitle('');
      setOptions([
        { text: '', media: null },
        { text: '', media: null }
      ]);
      setIsCreating(false);
      setIsOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Crear Nueva Votación Visual
          </DialogTitle>
          <DialogDescription>
            Crea una pregunta interesante y agrega imágenes o videos para cada opción.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Pregunta
            </Label>
            <Textarea
              id="title"
              placeholder="Ej: ¿Quién ganó el mejor outfit de hoy?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-[80px] resize-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Opciones con Media */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Opciones con imágenes/videos
            </Label>
            {options.map((option, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    placeholder={`Descripción opción ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    className="flex-1 focus:ring-2 focus:ring-blue-500/20"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Media Upload/Preview */}
                <div className="space-y-2">
                  {option.media ? (
                    <MediaUploadPreview 
                      media={option.media}
                      isVideo={option.media.type === 'video'}
                      onRemove={() => updateOption(index, 'media', null)}
                    />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <div className="space-y-2">
                        <div className="flex justify-center gap-2">
                          <Image className="w-8 h-8 text-gray-400" />
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600">
                          Arrastra una imagen o video aquí
                        </p>
                        <div className="flex justify-center gap-2">
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
                            <Button type="button" variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                              <Upload className="w-4 h-4 mr-1" />
                              Subir Archivo
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
                className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar opción
              </Button>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isCreating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
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