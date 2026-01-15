import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Check, Share, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-2xl font-display text-foreground mb-4">
            App Instalado!
          </h1>
          <p className="text-muted-foreground mb-6">
            O app Conquistas já está instalado no seu dispositivo.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-gold text-background hover:opacity-90"
          >
            Abrir App
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 bg-gradient-gold rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-gold">
          <Smartphone className="w-12 h-12 text-background" />
        </div>

        <h1 className="text-3xl font-display text-foreground mb-4">
          Instalar Conquistas
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Instale o app na tela inicial do seu celular para acesso rápido e experiência completa.
        </p>

        {isIOS ? (
          <div className="bg-card border border-gold/20 rounded-2xl p-6 text-left">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Como instalar no iPhone/iPad:
            </h3>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-gold text-sm flex-shrink-0">1</span>
                <span>Toque no botão <Share className="w-4 h-4 inline text-gold" /> Compartilhar na barra do Safari</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-gold text-sm flex-shrink-0">2</span>
                <span>Role para baixo e toque em "Adicionar à Tela de Início"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-gold text-sm flex-shrink-0">3</span>
                <span>Toque em "Adicionar" no canto superior direito</span>
              </li>
            </ol>
          </div>
        ) : deferredPrompt ? (
          <Button
            onClick={handleInstall}
            size="lg"
            className="bg-gradient-gold text-background hover:opacity-90 w-full py-6 text-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Instalar Agora
          </Button>
        ) : (
          <div className="bg-card border border-gold/20 rounded-2xl p-6 text-left">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Como instalar no Android:
            </h3>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-gold text-sm flex-shrink-0">1</span>
                <span>Toque no menu <MoreVertical className="w-4 h-4 inline text-gold" /> (3 pontinhos) do Chrome</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-gold text-sm flex-shrink-0">2</span>
                <span>Toque em "Adicionar à tela inicial" ou "Instalar app"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-gold text-sm flex-shrink-0">3</span>
                <span>Confirme tocando em "Adicionar"</span>
              </li>
            </ol>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mt-6 text-muted-foreground"
        >
          Continuar no navegador
        </Button>
      </motion.div>
    </div>
  );
};

export default Install;
