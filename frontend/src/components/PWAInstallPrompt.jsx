import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, Smartphone, X, CheckCircle } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show install prompt for mobile devices after 3 seconds
    const timer = setTimeout(() => {
      if (!isInstalled && (iOS || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        setShowInstallPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      // Manual install for browsers that don't support beforeinstallprompt
      setShowIOSInstructions(true);
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  const dismissIOSInstructions = () => {
    setShowIOSInstructions(false);
  };

  // Don't show if already installed or dismissed
  if (isInstalled || sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  // iOS Installation Instructions Modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative">
          <button
            onClick={dismissIOSInstructions}
            className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Instalar VotaTok
            </h3>
            
            <p className="text-gray-600 mb-6">
              Para instalar esta app en tu dispositivo:
            </p>

            {isIOS ? (
              <div className="text-left space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    Toca el botón de <strong>Compartir</strong> <span className="inline-block">📤</span> en la parte inferior
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    Selecciona <strong>"Añadir a pantalla de inicio"</strong> <span className="inline-block">📱</span>
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    Confirma tocando <strong>"Añadir"</strong>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-left space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    Abre el <strong>menú del navegador</strong> (tres puntos ⋮)
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    Selecciona <strong>"Instalar app"</strong> o <strong>"Añadir a pantalla de inicio"</strong>
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    Confirma la instalación
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={dismissIOSInstructions}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
            >
              ¡Entendido!
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Install Prompt
  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-4 shadow-2xl">
        <button
          onClick={dismissPrompt}
          className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              Instalar VotaTok
            </h3>
            <p className="text-white/90 text-sm mb-3">
              Descarga la app para una experiencia completa con acceso offline
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              >
                <Download className="w-4 h-4 mr-1" />
                Instalar
              </Button>
              
              <Button
                onClick={dismissPrompt}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                Más tarde
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <CheckCircle className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs text-white/80">Acceso offline</p>
            </div>
            <div>
              <CheckCircle className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs text-white/80">Notificaciones</p>
            </div>
            <div>
              <CheckCircle className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs text-white/80">Más rápido</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;