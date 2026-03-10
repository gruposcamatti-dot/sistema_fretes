-- Supabase SQL Schema for Logistics Freight Dashboard

-- Create the fretes table
CREATE TABLE public.fretes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    origem TEXT NOT NULL,
    data DATE NOT NULL,
    frota TEXT NOT NULL,
    motorista TEXT NOT NULL,
    tipo_frete TEXT NOT NULL,
    volume NUMERIC NOT NULL,
    valor NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.fretes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all data
CREATE POLICY "Allow authenticated users to read fretes"
ON public.fretes
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow authenticated users to insert data
CREATE POLICY "Allow authenticated users to insert fretes"
ON public.fretes
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create indexes for better performance on common queries
CREATE INDEX idx_fretes_data ON public.fretes(data);
CREATE INDEX idx_fretes_origem ON public.fretes(origem);
CREATE INDEX idx_fretes_motorista ON public.fretes(motorista);
CREATE INDEX idx_fretes_frota ON public.fretes(frota);

-- Example data insertion
/*
INSERT INTO public.fretes (origem, data, frota, motorista, tipo_frete, volume, valor)
VALUES 
('Mineração Grandes Lagos Ltda - Icém', '2025-01-15', 'Frota A', 'João Silva', 'Granel', 35.5, 1250.00),
('Noromix Concreto S/A - Andradina', '2025-02-10', 'Frota B', 'Pedro Santos', 'Saca', 20.0, 850.50),
('Porto de Areia Saara - Mira Estrela', '2025-03-05', 'Frota C', 'Marcos Oliveira', 'Líquido', 45.2, 2100.00);
*/
