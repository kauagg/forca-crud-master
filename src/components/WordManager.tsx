import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWords, useCreateWord, useUpdateWord, useDeleteWord, useCategories } from '@/hooks/useWords';
import { Word } from '@/types/word';
import { Plus, Pencil, Trash2, X, Check, Search, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordManagerProps {
  onBack: () => void;
}

export function WordManager({ onBack }: WordManagerProps) {
  const { data: words, isLoading } = useWords();
  const { data: categories } = useCategories();
  const createWord = useCreateWord();
  const updateWord = useUpdateWord();
  const deleteWord = useDeleteWord();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ word: '', category: '', hint: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [newWord, setNewWord] = useState({ word: '', category: '', hint: '' });

  const filteredWords = words?.filter(w => {
    const matchesSearch = w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'todas' || w.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = () => {
    if (!newWord.word.trim() || !newWord.category.trim()) return;
    createWord.mutate({
      word: newWord.word.toUpperCase(),
      category: newWord.category.toLowerCase(),
      hint: newWord.hint || null,
    });
    setNewWord({ word: '', category: '', hint: '' });
    setIsAdding(false);
  };

  const handleEdit = (word: Word) => {
    setEditingId(word.id);
    setEditForm({ word: word.word, category: word.category, hint: word.hint || '' });
  };

  const handleUpdate = () => {
    if (!editingId || !editForm.word.trim() || !editForm.category.trim()) return;
    updateWord.mutate({
      id: editingId,
      word: editForm.word.toUpperCase(),
      category: editForm.category.toLowerCase(),
      hint: editForm.hint || null,
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta palavra?')) {
      deleteWord.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-game text-xl sm:text-2xl text-primary text-glow">
            GERENCIAR PALAVRAS
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar palavra..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-10 px-3 rounded-lg bg-card border border-border text-foreground"
          >
            <option value="todas">Todas categorias</option>
            {categories?.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Button onClick={() => setIsAdding(true)} variant="game">
            <Plus className="w-4 h-4 mr-2" />
            Nova Palavra
          </Button>
        </div>

        {/* Add Form */}
        {isAdding && (
          <div className="bg-card border border-primary rounded-xl p-4 mb-4 neon-border">
            <h3 className="font-semibold text-primary mb-3">Adicionar Palavra</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <Input
                placeholder="Palavra"
                value={newWord.word}
                onChange={(e) => setNewWord({ ...newWord, word: e.target.value.toUpperCase() })}
                className="bg-muted border-border uppercase"
              />
              <Input
                placeholder="Categoria"
                value={newWord.category}
                onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                className="bg-muted border-border"
              />
              <Input
                placeholder="Dica (opcional)"
                value={newWord.hint}
                onChange={(e) => setNewWord({ ...newWord, hint: e.target.value })}
                className="bg-muted border-border"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                <X className="w-4 h-4 mr-1" /> Cancelar
              </Button>
              <Button variant="default" size="sm" onClick={handleCreate}>
                <Check className="w-4 h-4 mr-1" /> Salvar
              </Button>
            </div>
          </div>
        )}

        {/* Words List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : (
          <div className="space-y-2">
            {filteredWords?.map((word) => (
              <div
                key={word.id}
                className={cn(
                  "bg-card border border-border rounded-xl p-4",
                  "hover:border-primary/50 transition-colors"
                )}
              >
                {editingId === word.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Input
                        value={editForm.word}
                        onChange={(e) => setEditForm({ ...editForm, word: e.target.value.toUpperCase() })}
                        className="bg-muted border-border uppercase"
                      />
                      <Input
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="bg-muted border-border"
                      />
                      <Input
                        value={editForm.hint}
                        onChange={(e) => setEditForm({ ...editForm, hint: e.target.value })}
                        className="bg-muted border-border"
                        placeholder="Dica"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4 mr-1" /> Cancelar
                      </Button>
                      <Button variant="default" size="sm" onClick={handleUpdate}>
                        <Check className="w-4 h-4 mr-1" /> Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-game text-lg text-primary">{word.word}</span>
                      <span className="ml-3 px-2 py-1 rounded-full text-xs bg-secondary/20 text-secondary">
                        {word.category}
                      </span>
                      {word.hint && (
                        <p className="text-sm text-muted-foreground mt-1">💡 {word.hint}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(word)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(word.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredWords?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma palavra encontrada
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
