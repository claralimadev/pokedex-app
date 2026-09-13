export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
  stats: PokemonStats;
}

export interface PokemonEvolution {
  name: string;
  image: string;
}

export interface PokemonDetails extends Pokemon {
  height: number;
  weight: number;
  description: string;
  evolutions: PokemonEvolution[];
}
