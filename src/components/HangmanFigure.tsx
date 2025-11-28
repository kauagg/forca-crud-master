import { cn } from '@/lib/utils';

interface HangmanFigureProps {
  wrongGuesses: number;
  gameStatus: 'playing' | 'won' | 'lost';
}

export function HangmanFigure({ wrongGuesses, gameStatus }: HangmanFigureProps) {
  const parts = [
    // Head
    <circle
      key="head"
      cx="150"
      cy="70"
      r="25"
      className={cn(
        "fill-none stroke-current stroke-[3]",
        wrongGuesses >= 1 ? "text-neon-pink" : "text-muted"
      )}
    />,
    // Body
    <line
      key="body"
      x1="150"
      y1="95"
      x2="150"
      y2="150"
      className={cn(
        "stroke-current stroke-[3]",
        wrongGuesses >= 2 ? "text-neon-pink" : "text-muted"
      )}
    />,
    // Left arm
    <line
      key="left-arm"
      x1="150"
      y1="110"
      x2="120"
      y2="140"
      className={cn(
        "stroke-current stroke-[3]",
        wrongGuesses >= 3 ? "text-neon-pink" : "text-muted"
      )}
    />,
    // Right arm
    <line
      key="right-arm"
      x1="150"
      y1="110"
      x2="180"
      y2="140"
      className={cn(
        "stroke-current stroke-[3]",
        wrongGuesses >= 4 ? "text-neon-pink" : "text-muted"
      )}
    />,
    // Left leg
    <line
      key="left-leg"
      x1="150"
      y1="150"
      x2="120"
      y2="190"
      className={cn(
        "stroke-current stroke-[3]",
        wrongGuesses >= 5 ? "text-neon-pink" : "text-muted"
      )}
    />,
    // Right leg
    <line
      key="right-leg"
      x1="150"
      y1="150"
      x2="180"
      y2="190"
      className={cn(
        "stroke-current stroke-[3]",
        wrongGuesses >= 6 ? "text-neon-pink" : "text-muted"
      )}
    />,
  ];

  return (
    <div className={cn(
      "relative",
      gameStatus === 'lost' && "animate-shake"
    )}>
      <svg
        viewBox="0 0 250 220"
        className="w-full max-w-[250px] mx-auto"
      >
        {/* Gallows */}
        <line x1="60" y1="200" x2="140" y2="200" className="stroke-primary stroke-[3]" />
        <line x1="100" y1="200" x2="100" y2="20" className="stroke-primary stroke-[3]" />
        <line x1="100" y1="20" x2="150" y2="20" className="stroke-primary stroke-[3]" />
        <line x1="150" y1="20" x2="150" y2="45" className="stroke-primary stroke-[3]" />
        
        {/* Body parts */}
        {parts}

        {/* Face expressions */}
        {wrongGuesses >= 1 && (
          <>
            {gameStatus === 'lost' ? (
              <>
                {/* X eyes */}
                <line x1="140" y1="62" x2="148" y2="70" className="stroke-neon-pink stroke-[2]" />
                <line x1="148" y1="62" x2="140" y2="70" className="stroke-neon-pink stroke-[2]" />
                <line x1="152" y1="62" x2="160" y2="70" className="stroke-neon-pink stroke-[2]" />
                <line x1="160" y1="62" x2="152" y2="70" className="stroke-neon-pink stroke-[2]" />
                {/* Sad mouth */}
                <path d="M 140 82 Q 150 75 160 82" className="fill-none stroke-neon-pink stroke-[2]" />
              </>
            ) : gameStatus === 'won' ? (
              <>
                {/* Happy eyes */}
                <circle cx="144" cy="66" r="3" className="fill-primary" />
                <circle cx="156" cy="66" r="3" className="fill-primary" />
                {/* Happy mouth */}
                <path d="M 140 78 Q 150 88 160 78" className="fill-none stroke-primary stroke-[2]" />
              </>
            ) : (
              <>
                {/* Normal eyes */}
                <circle cx="144" cy="66" r="3" className="fill-neon-pink" />
                <circle cx="156" cy="66" r="3" className="fill-neon-pink" />
                {/* Worried mouth */}
                <line x1="142" y1="82" x2="158" y2="82" className="stroke-neon-pink stroke-[2]" />
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
