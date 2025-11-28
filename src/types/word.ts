export interface Word {
  id: string;
  word: string;
  category: string;
  hint: string | null;
  created_at: string;
  updated_at: string;
}

export type WordInsert = Omit<Word, 'id' | 'created_at' | 'updated_at'>;
export type WordUpdate = Partial<WordInsert>;
