import { cn } from '@/lib/utils';

interface WordDisplayProps {
  word: string;
  guessedLetters: Set<string>;
  gameStatus: 'playing' | 'won' | 'lost';
}

export function WordDisplay({ word, guessedLetters, gameStatus }: WordDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {word.split('').map((letter, index) => {
        const isRevealed = guessedLetters.has(letter) || gameStatus === 'lost';
        const isWrongReveal = gameStatus === 'lost' && !guessedLetters.has(letter);
        
        return (
          <div
            key={index}
            className={cn(
              "w-8 h-10 sm:w-12 sm:h-14 flex items-center justify-center",
              "border-b-4 transition-all duration-300",
              isRevealed ? "border-primary" : "border-muted",
              gameStatus === 'won' && "animate-float",
            )}
            style={{
              animationDelay: gameStatus === 'won' ? `${index * 100}ms` : undefined
            }}
          >
            <span
              className={cn(
                "font-game text-lg sm:text-2xl transition-all duration-300",
                isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-50",
                isWrongReveal ? "text-destructive" : "text-primary text-glow-sm"
              )}
            >
              {isRevealed ? letter : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
