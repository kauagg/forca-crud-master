import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Word, WordInsert, WordUpdate } from '@/types/word';
import { toast } from 'sonner';

export function useWords() {
  return useQuery({
    queryKey: ['words'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Word[];
    },
  });
}

export function useRandomWord(category?: string) {
  return useQuery({
    queryKey: ['random-word', category],
    queryFn: async () => {
      let query = supabase.from('words').select('*');
      
      if (category && category !== 'todas') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      if (!data || data.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex] as Word;
    },
    enabled: false,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('words')
        .select('category');
      
      if (error) throw error;
      
      const categories = [...new Set(data.map(w => w.category))];
      return categories;
    },
  });
}

export function useCreateWord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (word: WordInsert) => {
      const { data, error } = await supabase
        .from('words')
        .insert([{ ...word, word: word.word.toUpperCase() }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Palavra criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar palavra');
    },
  });
}

export function useUpdateWord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...word }: WordUpdate & { id: string }) => {
      const updateData = word.word ? { ...word, word: word.word.toUpperCase() } : word;
      const { data, error } = await supabase
        .from('words')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Palavra atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar palavra');
    },
  });
}

export function useDeleteWord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Palavra deletada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao deletar palavra');
    },
  });
}
