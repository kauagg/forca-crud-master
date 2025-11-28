import { useState } from 'react';
import { HangmanGame } from '@/components/HangmanGame';
import { WordManager } from '@/components/WordManager';

const Index = () => {
  const [view, setView] = useState<'game' | 'manage'>('game');

  if (view === 'manage') {
    return <WordManager onBack={() => setView('game')} />;
  }

  return <HangmanGame onManageWords={() => setView('manage')} />;
};

export default Index;
