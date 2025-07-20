import React, { useState } from 'react';
import { Button } from './ui/button';
import { 
  Download, 
  Share2, 
  Image, 
  FileText, 
  Copy,
  CheckCircle,
  Smartphone,
  X
} from 'lucide-react';
import { 
  downloadPollImage, 
  downloadPollData, 
  sharePoll, 
  getDeviceCapabilities 
} from '../utils/downloadUtils';
import { useToast } from '../hooks/use-toast';

const DownloadButton = ({ poll, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  
  const capabilities = getDeviceCapabilities();

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const success = await downloadPollImage(poll);
      if (success) {
        toast({
          title: "¡Descarga completa!",
          description: "La imagen de la encuesta se ha descargado exitosamente",
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast({
        title: "Error al descargar",
        description: "No se pudo descargar la imagen",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
      setIsOpen(false);
    }
  };

  const handleDownloadData = async () => {
    setIsDownloading(true);
    try {
      const success = downloadPollData(poll);
      if (success) {
        toast({
          title: "¡Datos descargados!",
          description: "Los datos de la encuesta se han descargado como JSON",
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast({
        title: "Error al descargar",
        description: "No se pudieron descargar los datos",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
      setIsOpen(false);
    }
  };

  const handleShare = async () => {
    setIsDownloading(true);
    try {
      const result = await sharePoll(poll);
      
      if (result === true) {
        toast({
          title: "¡Compartido!",
          description: "La encuesta se ha compartido exitosamente",
        });
      } else if (result === 'clipboard') {
        toast({
          title: "¡Copiado al portapapeles!",
          description: "La imagen se ha copiado al portapapeles",
        });
      } else if (result === 'download') {
        toast({
          title: "Descargando...",
          description: "La imagen se está descargando para compartir",
        });
      } else {
        throw new Error('Share failed');
      }
    } catch (error) {
      toast({
        title: "Error al compartir",
        description: "No se pudo compartir la encuesta",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`
          bg-black/60 text-white hover:bg-black/80 backdrop-blur-md 
          border border-white/20 h-12 w-12 p-0 rounded-full shadow-2xl 
          transition-all duration-200 hover:scale-110 ${className}
        `}
        size="sm"
      >
        <Download className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className={`
      bg-black/80 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20
      min-w-[280px] ${className}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Download className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-white font-semibold">Descargar & Compartir</h3>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {/* Share (Mobile prioritized) */}
        {capabilities.canShare && (
          <Button
            onClick={handleShare}
            disabled={isDownloading}
            className="w-full justify-start bg-green-600/80 hover:bg-green-600 text-white border-none"
          >
            <Share2 className="w-4 h-4 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Compartir encuesta</div>
              <div className="text-xs opacity-80">Compartir como imagen</div>
            </div>
            {capabilities.isMobile && (
              <Smartphone className="w-4 h-4 ml-auto opacity-60" />
            )}
          </Button>
        )}

        {/* Download Image */}
        <Button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="w-full justify-start bg-blue-600/80 hover:bg-blue-600 text-white border-none"
        >
          <Image className="w-4 h-4 mr-3" />
          <div className="text-left">
            <div className="font-semibold">Descargar imagen</div>
            <div className="text-xs opacity-80">PNG con resultados</div>
          </div>
        </Button>

        {/* Download Data */}
        <Button
          onClick={handleDownloadData}
          disabled={isDownloading}
          className="w-full justify-start bg-purple-600/80 hover:bg-purple-600 text-white border-none"
        >
          <FileText className="w-4 h-4 mr-3" />
          <div className="text-left">
            <div className="font-semibold">Descargar datos</div>
            <div className="text-xs opacity-80">JSON con estadísticas</div>
          </div>
        </Button>

        {/* Copy to clipboard (if available) */}
        {capabilities.canClipboard && !capabilities.canShare && (
          <Button
            onClick={handleShare}
            disabled={isDownloading}
            className="w-full justify-start bg-orange-600/80 hover:bg-orange-600 text-white border-none"
          >
            <Copy className="w-4 h-4 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Copiar imagen</div>
              <div className="text-xs opacity-80">Al portapapeles</div>
            </div>
          </Button>
        )}
      </div>

      {/* Device info */}
      <div className="mt-4 pt-3 border-t border-white/20">
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <div className="flex items-center gap-1">
            {capabilities.isMobile && <Smartphone className="w-3 h-3" />}
            {capabilities.isStandalone && <CheckCircle className="w-3 h-3" />}
            <span>
              {capabilities.isMobile ? 'Móvil' : 'Escritorio'}
              {capabilities.isStandalone && ' • App instalada'}
            </span>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isDownloading && (
        <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;