import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { HangmanFigure } from './HangmanFigure';
import { WordDisplay } from './WordDisplay';
import { Keyboard } from './Keyboard';
import { GameStatus } from './GameStatus';
import { useCategories } from '@/hooks/useWords';
import { supabase } from '@/integrations/supabase/client';
import { Word } from '@/types/word';
import { Settings, RotateCcw, Lightbulb, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_WRONG_GUESSES = 6;

interface HangmanGameProps {
  onManageWords: () => void;
}

export function HangmanGame({ onManageWords }: HangmanGameProps) {
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRandomWord = useCallback(async () => {
    setIsLoading(true);
    let query = supabase.from('words').select('*');
    
    if (selectedCategory !== 'todas') {
      query = query.eq('category', selectedCategory);
    }
    
    const { data, error } = await query;
    
    if (!error && data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setCurrentWord(data[randomIndex] as Word);
    }
    setIsLoading(false);
  }, [selectedCategory]);

  const startNewGame = useCallback(() => {
    setGuessedLetters(new Set());
    setGameStatus('playing');
    setShowHint(false);
    fetchRandomWord();
  }, [fetchRandomWord]);

  useEffect(() => {
    startNewGame();
  }, []);

  const correctLetters = new Set(
    currentWord?.word.split('').filter(letter => guessedLetters.has(letter)) || []
  );

  const wrongGuesses = [...guessedLetters].filter(
    letter => !currentWord?.word.includes(letter)
  ).length;

  const handleGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (currentWord) {
      const allLettersGuessed = currentWord.word
        .split('')
        .every(l => newGuessedLetters.has(l));

      if (allLettersGuessed) {
        setGameStatus('won');
      } else if (
        [...newGuessedLetters].filter(l => !currentWord.word.includes(l)).length >= MAX_WRONG_GUESSES
      ) {
        setGameStatus('lost');
      }
    }
  };

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter) && gameStatus === 'playing') {
        handleGuess(letter);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, guessedLetters, currentWord]);

  if (isLoading || !currentWord) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-game text-lg sm:text-2xl text-primary text-glow">
            JOGO DA FORCA
          </h1>
          <Button variant="outline" size="sm" onClick={onManageWords}>
            <Settings className="w-4 h-4 mr-2" />
            Palavras
          </Button>
        </div>

        {/* Category selector */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Categoria:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCategory('todas');
                startNewGame();
              }}
              className={cn(
                "px-3 py-1 rounded-full text-sm transition-all",
                selectedCategory === 'todas'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Todas
            </button>
            {categories?.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  startNewGame();
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-sm transition-all capitalize",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Game area */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-6">
          {/* Wrong guesses indicator */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-1">
              {Array.from({ length: MAX_WRONG_GUESSES }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    i < wrongGuesses ? "bg-destructive" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {MAX_WRONG_GUESSES - wrongGuesses} tentativas restantes
            </span>
          </div>

          {/* Hangman figure */}
          <HangmanFigure wrongGuesses={wrongGuesses} gameStatus={gameStatus} />

          {/* Hint button and display */}
          {currentWord.hint && (
            <div className="mt-4 text-center">
              {showHint ? (
                <p className="text-accent text-sm animate-in fade-in">
                  💡 {currentWord.hint}
                </p>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  className="text-accent hover:text-accent"
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Ver dica
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Word display */}
        <div className="mb-8">
          <WordDisplay
            word={currentWord.word}
            guessedLetters={guessedLetters}
            gameStatus={gameStatus}
          />
        </div>

        {/* Keyboard */}
        <Keyboard
          guessedLetters={guessedLetters}
          correctLetters={correctLetters}
          onGuess={handleGuess}
          disabled={gameStatus !== 'playing'}
        />

        {/* New game button */}
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={startNewGame}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Nova Palavra
          </Button>
        </div>
      </div>

      {/* Game status modal */}
      <GameStatus
        status={gameStatus}
        word={currentWord.word}
        onNewGame={startNewGame}
      />
    </div>
  );
}
