export interface IdRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export type ClassificationTab = 'type' | 'generation' | 'region';

export const GENERATIONS: IdRange[] = [
  { id: 'gen1', label: 'I', min: 1, max: 151 },
  { id: 'gen2', label: 'II', min: 152, max: 251 },
  { id: 'gen3', label: 'III', min: 252, max: 386 },
  { id: 'gen4', label: 'IV', min: 387, max: 493 },
  { id: 'gen5', label: 'V', min: 494, max: 649 },
  { id: 'gen6', label: 'VI', min: 650, max: 721 },
  { id: 'gen7', label: 'VII', min: 722, max: 809 },
  { id: 'gen8', label: 'VIII', min: 810, max: 905 },
  { id: 'gen9', label: 'IX', min: 906, max: 1025 },
];

export const REGIONS: IdRange[] = [
  { id: 'kanto', label: 'Kanto', min: 1, max: 151 },
  { id: 'johto', label: 'Johto', min: 152, max: 251 },
  { id: 'hoenn', label: 'Hoenn', min: 252, max: 386 },
  { id: 'sinnoh', label: 'Sinnoh', min: 387, max: 493 },
  { id: 'unova', label: 'Unova', min: 494, max: 649 },
  { id: 'kalos', label: 'Kalos', min: 650, max: 721 },
  { id: 'alola', label: 'Alola', min: 722, max: 809 },
  { id: 'galar', label: 'Galar', min: 810, max: 905 },
  { id: 'paldea', label: 'Paldea', min: 906, max: 1025 },
];

export function inRange(id: number, range: IdRange): boolean {
  return id >= range.min && id <= range.max;
}

export interface GenerationHighlight {
  genId: string;
  generation: string;
  strongestId: number;
  strongestName: string;
  trainer: string;
}

export const GENERATION_HIGHLIGHTS: GenerationHighlight[] = [
  {
    genId: 'gen1',
    generation: 'I',
    strongestId: 150,
    strongestName: 'Mewtwo',
    trainer: 'Red',
  },
  {
    genId: 'gen2',
    generation: 'II',
    strongestId: 250,
    strongestName: 'Ho-Oh',
    trainer: 'Lance',
  },
  {
    genId: 'gen3',
    generation: 'III',
    strongestId: 384,
    strongestName: 'Rayquaza',
    trainer: 'Steven Stone',
  },
  {
    genId: 'gen4',
    generation: 'IV',
    strongestId: 493,
    strongestName: 'Arceus',
    trainer: 'Cynthia',
  },
  {
    genId: 'gen5',
    generation: 'V',
    strongestId: 646,
    strongestName: 'Kyurem',
    trainer: 'Alder',
  },
  {
    genId: 'gen6',
    generation: 'VI',
    strongestId: 716,
    strongestName: 'Xerneas',
    trainer: 'Diantha',
  },
  {
    genId: 'gen7',
    generation: 'VII',
    strongestId: 800,
    strongestName: 'Necrozma',
    trainer: 'Ash',
  },
  {
    genId: 'gen8',
    generation: 'VIII',
    strongestId: 890,
    strongestName: 'Eternatus',
    trainer: 'Leon',
  },
  {
    genId: 'gen9',
    generation: 'IX',
    strongestId: 1008,
    strongestName: 'Miraidon',
    trainer: 'Geeta',
  },
];
