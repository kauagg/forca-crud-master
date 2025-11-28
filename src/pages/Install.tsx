import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, CheckCircle, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
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
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="font-game text-2xl text-primary text-glow">Instalado!</h1>
          <p className="text-muted-foreground">O app já está na sua tela inicial.</p>
          <Button variant="game" onClick={() => window.location.href = "/"}>
            Jogar Agora
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-card rounded-2xl flex items-center justify-center neon-border">
            <Smartphone className="w-12 h-12 text-primary" />
          </div>
          <h1 className="font-game text-xl md:text-2xl text-primary text-glow">
            Instalar App
          </h1>
          <p className="text-muted-foreground">
            Instale o Jogo da Forca no seu celular para jogar offline!
          </p>
        </div>

        {isIOS ? (
          <div className="bg-card p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold text-foreground">No iPhone/iPad:</h2>
            <ol className="text-left space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <span>Toque no botão <Share className="inline w-4 h-4" /> Compartilhar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <span>Role e toque em "Adicionar à Tela de Início"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                <span>Toque em "Adicionar"</span>
              </li>
            </ol>
          </div>
        ) : deferredPrompt ? (
          <Button variant="game" size="lg" onClick={handleInstall} className="w-full">
            <Download className="w-5 h-5 mr-2" />
            Instalar Agora
          </Button>
        ) : (
          <div className="bg-card p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold text-foreground">No Android:</h2>
            <ol className="text-left space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <span>Toque no menu ⋮ do navegador</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <span>Toque em "Instalar app" ou "Adicionar à tela inicial"</span>
              </li>
            </ol>
          </div>
        )}

        <Button variant="ghost" onClick={() => window.location.href = "/"} className="text-muted-foreground">
          Continuar no navegador
        </Button>
      </div>
    </div>
  );
};

export default Install;
