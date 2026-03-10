export type FreightRecord = {
  id: string;
  origem: string;
  data: string;
  frota: string;
  motorista: string;
  tipo_frete: string;
  volume: number;
  valor: number;
  created_at: string;
};

export const SEGMENTS = {
  PEDREIRAS: [
    'Mineração Grandes Lagos Ltda - Icém',
    'Mineração Grandes Lagos Ltda - Itapura',
    'Mineração Grandes Lagos Ltda - Riolândia',
    'Mineração Grandes Lagos Ltda - Três Fronteiras',
    'Mineração Noroeste Paulista - Monções',
    'Noromix Concreto S/A - Rinópolis Pedreira',
  ],
  PORTOS: [
    'Porto de Areia Saara - Mira Estrela',
    'Mineração Agua Amarela - Riolândia',
  ],
  CONCRETEIRAS: [
    'Noromix Concreto S/A - Andradina',
    'Noromix Concreto S/A - Fernandópolis',
    'Noromix Concreto S/A - Ilha Solteira',
    'Noromix Concreto S/A - Jales',
    'Noromix Concreto S/A - Monções',
    'Noromix Concreto S/A - Ouroeste',
    'Noromix Concreto S/A - Paranaíba',
    'Noromix Concreto S/A - Pereira Barreto',
    'Noromix Concreto S/A - Três Fronteiras',
    'Noromix Concreto S/A - Votuporanga',
  ],
  FABRICA_DE_TUBOS: [
    'Fábrica de Tubos - Votuporanga',
  ],
};

export type SegmentType = keyof typeof SEGMENTS;

export type FilterState = {
  periodo: string;
  ano: string;
  segmento: string;
  unidade: string;
};
