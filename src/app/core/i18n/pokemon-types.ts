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
    quizAria: '"Quem é esse Pokémon?"',
    closeQuiz: 'Fechar quiz',
    gameOverScore: 'Você acertou {s} de {r} Pokémons.',
    record: '🏆 Recorde:',
    retry: 'Tentar novamente',
    quizLoading: 'Carregando…',
    correct: '✨ Correto!',
    wrong: 'Errou!',
    isThe: 'É o {n}!',
    livesLabel: 'Vidas restantes',
    next: 'Próximo',
    skip: 'Pular',
    menu: 'Menu',
    languageLabel: 'Idioma / Language',
    favorites: '⚡ Favoritos',
    classifications: 'Classificações',
    tabType: '⭐ Tipo',
    tabGeneration: '🌐 Geração',
    tabRegion: '🗺️ Região',
    generation: 'Geração',
    highlights: '🏆 Destaques por Geração',
    strongest: '⚡ Mais forte:',
    bestTrainer: '🧢 Melhor treinador:',
    quizMenu: '🎮 Quiz',
    aboutMenu: '👩‍💻 Sobre mim',
    clearFilter: 'Limpar filtro e mostrar todos',
    heroTitle: 'Bem-vindo, Treinador!',
    heroSubtitle: 'Explore a Pokédex e encontre seus Pokémons favoritos.',
    searchPlaceholder: 'Buscar um Pokémon por nome ou ID',
    filterAria: 'Filtrar por tipo de Pokémon',
    foundLabel: '🔎 Encontrado na Pokédex:',
    empty: 'Nenhum Pokémon encontrado.',
    loadingMore: 'Carregando...',
    loadMore: 'Carregar Mais',
    close: 'Fechar',
    themeToLight: 'Ativar tema claro',
    themeToDark: 'Ativar tema escuro',
    winnerBadge: '⚡ Vencedor',
    winnerSentence: '{w} venceu com {wt} pontos no total de atributos contra {lt} de {l}.',
    advantagesIntro: 'Vantagem em:',
    tie: 'Empate em atributos totais — nenhum dos dois leva o troféu!',
    aboutBadge: '👩‍💻 Sobre mim',
    aboutRole: 'Desenvolvedora Front-end em formação',
    aboutSkills: 'Minhas habilidades',
    aboutProject: 'Sobre este projeto',
    aboutPara1:
      'Sou técnica em Mecatrônica pelo SENAI e estudante de Engenharia de Software na UniAteneu. Hoje integro o Squad Proenergia no Hackathon Proenergia Summit 2026, unindo a base técnica de automação industrial e IoT ao universo das interfaces web modernas.',
    aboutPara2:
      'Minha formação em Mecatrônica me ensinou a enxergar sistemas por inteiro — do sensor ao código. O que me move é construir interfaces que combinam essa precisão técnica com um design que todas as pessoas consigam usar.',
    aboutPara3:
      'Acredito que a web precisa ser um lugar para todo mundo, por isso estudo acessibilidade e inclusão todos os dias — para que nenhuma pessoa fique de fora da experiência digital.',
    aboutProjectPara:
      'Esta Pokédex é uma SPA feita com Angular (TypeScript e SCSS) que consome a PokéAPI: busca global por nome ou número, filtros por tipo/geração/região, favoritos, comparação de Pokémon, destaques por geração e um minigame de "quem é esse Pokémon?" com recorde salvo — tudo com acessibilidade e o suporte de libras (VLibras).',
  },
  'en-US': {
    height: 'Height',
    weight: 'Weight',
    description: 'Description / Lore',
    stats: 'Stats',
    evolution: 'Evolution Line',
    loading: 'Loading details...',
    quizAria: '"Who\'s That Pokémon?"',
    closeQuiz: 'Close quiz',
    gameOverScore: 'You got {s} out of {r} right.',
    record: '🏆 Record:',
    retry: 'Try again',
    quizLoading: 'Loading…',
    correct: '✨ Correct!',
    wrong: 'Wrong!',
    isThe: "It's {n}!",
    livesLabel: 'Remaining lives',
    next: 'Next',
    skip: 'Skip',
    menu: 'Menu',
    languageLabel: 'Language / Idioma',
    favorites: '⚡ Favorites',
    classifications: 'Classifications',
    tabType: '⭐ Type',
    tabGeneration: '🌐 Generation',
    tabRegion: '🗺️ Region',
    generation: 'Generation',
    highlights: '🏆 Highlights by Generation',
    strongest: '⚡ Strongest:',
    bestTrainer: '🧢 Best trainer:',
    quizMenu: '🎮 Quiz',
    aboutMenu: '👩‍💻 About me',
    clearFilter: 'Clear filter and show all',
    heroTitle: 'Welcome, Trainer!',
    heroSubtitle: 'Explore the Pokédex and find your favorite Pokémon.',
    searchPlaceholder: 'Search for a Pokémon by name or ID',
    filterAria: 'Filter by Pokémon type',
    foundLabel: '🔎 Found in the Pokédex:',
    empty: 'No Pokémon found.',
    loadingMore: 'Loading...',
    loadMore: 'Load More',
    close: 'Close',
    themeToLight: 'Enable light theme',
    themeToDark: 'Enable dark theme',
    winnerBadge: '⚡ Winner',
    winnerSentence: "{w} won with {wt} total stat points against {l}'s {lt}.",
    advantagesIntro: 'Advantage in:',
    tie: 'Tie in total stats — neither one takes the trophy!',
    aboutBadge: '👩‍💻 About me',
    aboutRole: 'Front-end Developer in training',
    aboutSkills: 'My skills',
    aboutProject: 'About this project',
    aboutPara1:
      'I am a Mechatronics technician from SENAI and a Software Engineering student at UniAteneu. Today I am part of Squad Proenergia at the Proenergia Summit 2026 Hackathon, bringing together the technical foundations of industrial automation and IoT with the world of modern web interfaces.',
    aboutPara2:
      'My Mechatronics background taught me to see systems as a whole — from sensor to code. What drives me is building interfaces that combine that technical precision with a design everyone can use.',
    aboutPara3:
      'I believe the web needs to be a place for everyone, so I study accessibility and inclusion every day — so that no one is left out of the digital experience.',
    aboutProjectPara:
      'This Pokédex is an SPA built with Angular (TypeScript and SCSS) that consumes the PokéAPI: global search by name or number, filters by type/generation/region, favorites, Pokémon comparison, generation highlights and a "Who\'s That Pokémon?" minigame with saved record — all with accessibility and LIBRAS (VLibras) support.',
  },
  'es-ES': {
    height: 'Altura',
    weight: 'Peso',
    description: 'Descripción / Lore',
    stats: 'Estadísticas',
    evolution: 'Línea evolutiva',
    loading: 'Cargando detalles...',
    quizAria: '"¿Quién es ese Pokémon?"',
    closeQuiz: 'Cerrar juego',
    gameOverScore: 'Acertaste {s} de {r} Pokémon.',
    record: '🏆 Récord:',
    retry: 'Intentar de nuevo',
    quizLoading: 'Cargando…',
    correct: '✨ ¡Correcto!',
    wrong: '¡Fallaste!',
    isThe: '¡Es {n}!',
    livesLabel: 'Vidas restantes',
    next: 'Siguiente',
    skip: 'Saltar',
    menu: 'Menú',
    languageLabel: 'Idioma / Language',
    favorites: '⚡ Favoritos',
    classifications: 'Clasificaciones',
    tabType: '⭐ Tipo',
    tabGeneration: '🌐 Generación',
    tabRegion: '🗺️ Región',
    generation: 'Generación',
    highlights: '🏆 Destacados por generación',
    strongest: '⚡ Más fuerte:',
    bestTrainer: '🧢 Mejor entrenador:',
    quizMenu: '🎮 Quiz',
    aboutMenu: '👩‍💻 Sobre mí',
    clearFilter: 'Limpiar filtro y mostrar todos',
    heroTitle: '¡Bienvenido, Entrenador!',
    heroSubtitle: 'Explora la Pokédex y encuentra tus Pokémon favoritos.',
    searchPlaceholder: 'Buscar un Pokémon por nombre o ID',
    filterAria: 'Filtrar por tipo de Pokémon',
    foundLabel: '🔎 Encontrado en la Pokédex:',
    empty: 'No se encontró ningún Pokémon.',
    loadingMore: 'Cargando...',
    loadMore: 'Cargar más',
    close: 'Cerrar',
    themeToLight: 'Activar tema claro',
    themeToDark: 'Activar tema oscuro',
    winnerBadge: '⚡ Ganador',
    winnerSentence: '{w} ganó con {wt} puntos en total de atributos frente a los {lt} de {l}.',
    advantagesIntro: 'Ventaja en:',
    tie: '¡Empate en atributos totales — ninguno se lleva el trofeo!',
    aboutBadge: '👩‍💻 Sobre mí',
    aboutRole: 'Desarrolladora Front-end en formación',
    aboutSkills: 'Mis habilidades',
    aboutProject: 'Sobre este proyecto',
    aboutPara1:
      'Soy técnica en Mecatrónica por el SENAI y estudiante de Ingeniería de Software en la UniAteneu. Hoy formo parte del Squad Proenergia en el Hackathon Proenergia Summit 2026, uniendo la base técnica de la automatización industrial y la IoT con el universo de las interfaces web modernas.',
    aboutPara2:
      'Mi formación en Mecatrónica me enseñó a ver los sistemas de forma integral — del sensor al código. Lo que me mueve es construir interfaces que combinen esa precisión técnica con un diseño que todas las personas puedan usar.',
    aboutPara3:
      'Creo que la web debe ser un lugar para todos, por eso estudio accesibilidad e inclusión todos los días — para que ninguna persona quede fuera de la experiencia digital.',
    aboutProjectPara:
      'Esta Pokédex es una SPA hecha con Angular (TypeScript y SCSS) que consume la PokéAPI: búsqueda global por nombre o número, filtros por tipo/generación/región, favoritos, comparación de Pokémon, destacados por generación y un minigame de "¿Quién es ese Pokémon?" con récord guardado — todo con accesibilidad y el soporte de LIBRAS (VLibras).',
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

export function formatString(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
}

export function uiStringFormat(
  lang: Locale,
  key: string,
  params: Record<string, string | number>,
): string {
  return formatString(uiString(lang, key), params);
}
