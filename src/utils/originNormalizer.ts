import { SEGMENTS, ORIGIN_MAP, SegmentType } from '@/src/types';

/**
 * Normaliza o nome da origem para o formato padrão do sistema
 * Compara de forma case-insensitive e retorna o nome canonizado
 */
export function normalizeOrigin(origin: string): string {
  if (!origin) return origin;

  // Limpar espaços extras
  const cleanOrigin = origin.trim();

  // Tentar encontrar a origem no ORIGIN_MAP (valores)
  const originFromMap = Object.values(ORIGIN_MAP).find(
    o => o.toLowerCase() === cleanOrigin.toLowerCase()
  );

  if (originFromMap) {
    return originFromMap;
  }

  // Tentar encontrar em todos os segmentos
  for (const segment of Object.values(SEGMENTS)) {
    const found = segment.find(s => s.toLowerCase() === cleanOrigin.toLowerCase());
    if (found) {
      return found;
    }
  }

  // Se não encontrar, retornar no formato Title Case
  return titleCase(cleanOrigin);
}

/**
 * Converte string para Title Case (cada palavra começa com maiúscula)
 */
function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Retorna o segmento da origem (case-insensitive)
 */
export function getSegmentByOrigin(origin: string): SegmentType | null {
  if (!origin) return null;

  const normalizedOrigin = normalizeOrigin(origin);

  for (const [segment, origins] of Object.entries(SEGMENTS)) {
    if (origins.some(o => o.toLowerCase() === normalizedOrigin.toLowerCase())) {
      return segment as SegmentType;
    }
  }

  return null;
}

/**
 * Retorna todas as origens normalizadas de um segmento
 */
export function getOriginsBySegment(segment: SegmentType | string): string[] {
  return SEGMENTS[segment as SegmentType] || [];
}

/**
 * Compara duas origens de forma case-insensitive
 */
export function compareOrigins(origin1: string, origin2: string): boolean {
  const normalized1 = normalizeOrigin(origin1).toLowerCase();
  const normalized2 = normalizeOrigin(origin2).toLowerCase();
  return normalized1 === normalized2;
}
