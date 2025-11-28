import { cn } from '@/lib/utils';

interface KeyboardProps {
  guessedLetters: Set<string>;
  correctLetters: Set<string>;
  onGuess: (letter: string) => void;
  disabled: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export function Keyboard({ guessedLetters, correctLetters, onGuess, disabled }: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-2">
          {row.map((letter) => {
            const isGuessed = guessedLetters.has(letter);
            const isCorrect = correctLetters.has(letter);
            const isWrong = isGuessed && !isCorrect;
            
            return (
              <button
                key={letter}
                onClick={() => onGuess(letter)}
                disabled={disabled || isGuessed}
                className={cn(
                  "w-7 h-9 sm:w-10 sm:h-12 rounded-lg font-semibold text-sm sm:text-base",
                  "transition-all duration-200 transform",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                  !isGuessed && !disabled && "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]",
                  isCorrect && "bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.5)]",
                  isWrong && "bg-destructive/30 text-destructive line-through",
                  disabled && !isGuessed && "opacity-50 cursor-not-allowed"
                )}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
