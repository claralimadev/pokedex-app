export type Locale = 'pt-BR' | 'en-US' | 'es-ES';

export const DEFAULT_LOCALE: Locale = 'pt-BR';

export const LOCALES: Locale[] = ['pt-BR', 'en-US', 'es-ES'];

export const TYPE_LIST = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

const TYPE_EMOJIS: Record<string, string> = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '🥊',
  poison: '☠️',
  ground: '⏳',
  flying: '🕊️',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌙',
  steel: '⚙️',
  fairy: '✨',
};

const TYPE_NAMES: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    normal: 'Normal',
    fire: 'Fogo',
    water: 'Água',
    electric: 'Elétrico',
    grass: 'Planta',
    ice: 'Gelo',
    fighting: 'Lutador',
    poison: 'Veneno',
    ground: 'Terrestre',
    flying: 'Voador',
    psychic: 'Psíquico',
    bug: 'Inseto',
    rock: 'Pedra',
    ghost: 'Fantasma',
    dragon: 'Dragão',
    dark: 'Sombrio',
    steel: 'Aço',
    fairy: 'Fada',
  },
  'en-US': {
    normal: 'Normal',
    fire: 'Fire',
    water: 'Water',
    electric: 'Electric',
    grass: 'Grass',
    ice: 'Ice',
    fighting: 'Fighting',
    poison: 'Poison',
    ground: 'Ground',
    flying: 'Flying',
    psychic: 'Psychic',
    bug: 'Bug',
    rock: 'Rock',
    ghost: 'Ghost',
    dragon: 'Dragon',
    dark: 'Dark',
    steel: 'Steel',
    fairy: 'Fairy',
  },
  'es-ES': {
    normal: 'Normal',
    fire: 'Fuego',
    water: 'Agua',
    electric: 'Eléctrico',
    grass: 'Planta',
    ice: 'Hielo',
    fighting: 'Lucha',
    poison: 'Veneno',
    ground: 'Tierra',
    flying: 'Volador',
    psychic: 'Psíquico',
    bug: 'Bicho',
    rock: 'Roca',
    ghost: 'Fantasma',
    dragon: 'Dragón',
    dark: 'Siniestro',
    steel: 'Acero',
    fairy: 'Hada',
  },
};

const UI_STRINGS: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    height: 'Altura',
    weight: 'Peso',
    description: 'Descrição / Lore',
    stats: 'Atributos',
    evolution: 'Linha Evolutiva',
    loading: 'Carregando detalhes...',
  },
  'en-US': {
    height: 'Height',
    weight: 'Weight',
    description: 'Description / Lore',
    stats: 'Stats',
    evolution: 'Evolution Line',
    loading: 'Loading details...',
  },
  'es-ES': {
    height: 'Altura',
    weight: 'Peso',
    description: 'Descripción / Lore',
    stats: 'Estadísticas',
    evolution: 'Línea evolutiva',
    loading: 'Cargando detalles...',
  },
};

export function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as string[]).includes(value);
}

export function typeName(lang: Locale, type: string): string {
  return TYPE_NAMES[lang][type] ?? type;
}

export function typeClass(type: string): string {
  return `type-${type}`;
}

export function typeLabel(lang: Locale, type: string): string {
  const emoji = TYPE_EMOJIS[type] ?? '';
  const name = typeName(lang, type);
  return emoji ? `${emoji} ${name}` : name;
}

export function flavorLanguage(lang: Locale): string {
  switch (lang) {
    case 'pt-BR':
      return 'pt';
    case 'es-ES':
      return 'es';
    default:
      return 'en';
  }
}

export function uiString(lang: Locale, key: string): string {
  return UI_STRINGS[lang][key] ?? key;
}
