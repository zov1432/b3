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
import { Plus, X, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CreatePollModal = ({ onCreatePoll, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
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

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: "Error", 
        description: "Necesitas al menos 2 opciones",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    // Simular creación
    setTimeout(() => {
      onCreatePoll({
        title: title.trim(),
        options: validOptions.map(opt => opt.trim())
      });

      toast({
        title: "¡Votación creada!",
        description: "Tu votación ha sido publicada exitosamente",
      });

      // Reset form
      setTitle('');
      setOptions(['', '']);
      setIsCreating(false);
      setIsOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-blue-50/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Crear Nueva Votación
          </DialogTitle>
          <DialogDescription>
            Crea una pregunta interesante y agrega hasta 4 opciones para que la gente vote.
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
              placeholder="Ej: ¿Cuál es tu película favorita de 2025?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-[80px] resize-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Opciones */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Opciones de respuesta
            </Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {String.fromCharCode(65 + index)}
                </div>
                <Input
                  placeholder={`Opción ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
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