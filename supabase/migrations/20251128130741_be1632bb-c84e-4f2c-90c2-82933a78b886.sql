-- Create words table for hangman game
CREATE TABLE public.words (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'geral',
  hint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for the game)
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read words
CREATE POLICY "Anyone can read words" 
ON public.words 
FOR SELECT 
USING (true);

-- Allow anyone to insert words
CREATE POLICY "Anyone can insert words" 
ON public.words 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update words
CREATE POLICY "Anyone can update words" 
ON public.words 
FOR UPDATE 
USING (true);

-- Allow anyone to delete words
CREATE POLICY "Anyone can delete words" 
ON public.words 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_words_updated_at
BEFORE UPDATE ON public.words
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial words
INSERT INTO public.words (word, category, hint) VALUES
('PROGRAMACAO', 'tecnologia', 'Arte de escrever código'),
('JAVASCRIPT', 'tecnologia', 'Linguagem de programação web'),
('COMPUTADOR', 'tecnologia', 'Máquina que processa dados'),
('ELEFANTE', 'animais', 'Maior mamífero terrestre'),
('BORBOLETA', 'animais', 'Inseto com asas coloridas'),
('CACHORRO', 'animais', 'Melhor amigo do homem'),
('CHOCOLATE', 'comidas', 'Doce feito de cacau'),
('ABACAXI', 'comidas', 'Fruta tropical espinhosa'),
('BRASIL', 'lugares', 'País da copa de 2014'),
('OCEANO', 'natureza', 'Grande massa de água salgada');