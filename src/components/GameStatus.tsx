import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameStatusProps {
  status: 'playing' | 'won' | 'lost';
  word: string;
  onNewGame: () => void;
}

export function GameStatus({ status, word, onNewGame }: GameStatusProps) {
  if (status === 'playing') return null;

  const isWon = status === 'won';

  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
      "flex items-center justify-center p-4"
    )}>
      <div className={cn(
        "bg-card border-2 rounded-2xl p-8 max-w-md w-full text-center",
        "transform animate-in zoom-in-95 duration-300",
        isWon ? "border-primary neon-border" : "border-destructive"
      )}>
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
          isWon ? "bg-primary/20" : "bg-destructive/20"
        )}>
          {isWon ? (
            <Trophy className="w-10 h-10 text-primary animate-pulse-glow" />
          ) : (
            <Skull className="w-10 h-10 text-destructive" />
          )}
        </div>

        <h2 className={cn(
          "font-game text-xl mb-2",
          isWon ? "text-primary text-glow" : "text-destructive"
        )}>
          {isWon ? 'VITÓRIA!' : 'GAME OVER'}
        </h2>

        <p className="text-muted-foreground mb-2">
          {isWon ? 'Parabéns! Você acertou!' : 'A palavra era:'}
        </p>

        <p className="font-game text-2xl text-foreground mb-6 tracking-wider">
          {word}
        </p>

        <Button
          onClick={onNewGame}
          variant="game"
          size="lg"
          className="w-full"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Jogar Novamente
        </Button>
      </div>
    </div>
  );
}
