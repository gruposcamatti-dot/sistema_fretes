export type FreightRecord = {
  id: string;
  origem: string;
  data: string;
  pedido: string;
  nota: string;
  cliente: string;
  cidade: string;
  frota: string;
  motorista: string;
  tipo_frete: string;
  material: string;
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

export const ORIGIN_MAP: Record<string, string> = {
  '1': 'Mineração Noroeste Paulista - Monções',
  '12': 'Mineração Grandes Lagos Ltda - Itapura',
  '13': 'Mineração Grandes Lagos Ltda - Riolândia',
  '16': 'Mineração Agua Amarela - Riolândia',
  '23': 'Porto de Areia Saara - Mira Estrela',
  '27': 'Mineração Grandes Lagos Ltda - Icém',
  '38': 'Noromix Concreto S/A - Fernandópolis',
  '40': 'Noromix Concreto S/A - Pereira Barreto',
  '47': 'Mineração Grandes Lagos Ltda - Três Fronteiras',
  '48': 'Noromix Concreto S/A - Votuporanga',
  '49': 'Fábrica de Tubos - Votuporanga',
  '58': 'Noromix Concreto S/A - Rinópolis Pedreira',
  '69': 'Noromix Concreto S/A - Ilha Solteira',
  '88': 'Noromix Concreto S/A - Paranaíba',
  '92': 'Noromix Concreto S/A - Jales',
  '94': 'Noromix Concreto S/A - Ouroeste',
  '96': 'Noromix Concreto S/A - Monções'
};

export const REVERSE_ORIGIN_MAP = Object.entries(ORIGIN_MAP).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

export type SegmentType = keyof typeof SEGMENTS;

export type FilterState = {
  periodo: string;
  ano: string;
  segmento: string;
  unidade: string;
  motorista?: string;
  frota?: string;
};
