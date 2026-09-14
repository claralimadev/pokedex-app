import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Pokemon, PokemonDetails, PokemonEvolution } from '../models/pokemon.model';
import { PT_FLAVOR_TEXTS } from '../data/flavor-texts.pt';

export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ slot: number; type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: { front_default: string | null };
    };
  };
}

export interface PokemonPage {
  pokemon: Pokemon[];
  next: string | null;
}

export interface PokemonTypeResponse {
  pokemon: Array<{ slot: number; pokemon: NamedApiResource }>;
}

export interface PokemonSpeciesResponse {
  flavor_text_entries: Array<{ flavor_text: string; language: { name: string } }>;
  evolution_chain: { url: string };
}

export interface EvolutionChainResponse {
  chain: EvolutionChainLink;
}

export interface EvolutionChainLink {
  species: NamedApiResource;
  evolves_to: EvolutionChainLink[];
}

@Injectable({ providedIn: 'root' })
export class PokemonApiService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private static readonly DEFAULT_LIMIT = 12;
  private static readonly MAX_POKEMON_ID = 1025;
  private nameListCache: NamedApiResource[] | null = null;

  constructor(private readonly http: HttpClient) {}

  getPokemonPage(offset = 0, limit = PokemonApiService.DEFAULT_LIMIT): Observable<PokemonPage> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon`, {
        params: { limit, offset },
      })
      .pipe(
        switchMap((page) => {
          const species = this.speciesOnly(page.results);
          if (species.length === 0) {
            return of({ pokemon: [], next: null });
          }
          return forkJoin(species.map((item) => this.getPokemonDetail(item.url))).pipe(
            map((pokemon) => ({ pokemon, next: page.next })),
          );
        }),
      );
  }

  searchPokemonByName(nameOrId: string): Observable<Pokemon> {
    return this.http
      .get<PokemonDetailResponse>(`${this.baseUrl}/pokemon/${nameOrId.trim().toLowerCase()}`)
      .pipe(map((pokemon) => this.toPokemon(pokemon)));
  }

  searchPokemonGlobal(query: string): Observable<Pokemon[]> {
    const normalized = query.trim().toLowerCase();
    if (/^\d{1,5}$/.test(normalized)) {
      const id = Number(normalized);
      if (id < 1 || id > PokemonApiService.MAX_POKEMON_ID) {
        return of([]);
      }
      return this.searchPokemonByName(normalized).pipe(
        map((pokemon) => [pokemon]),
        catchError(() => of([])),
      );
    }
    return this.getPokemonNameList().pipe(
      map((results) =>
        results
          .filter((entry) => {
            const name = entry.name;
            return (
              name.includes(normalized) ||
              name.replace(/-/g, ' ').includes(normalized) ||
              name.replace(/-/g, '').includes(normalized)
            );
          })
          .slice(0, 4)
          .map((entry) => entry.name),
      ),
      switchMap((names) =>
        names.length ? forkJoin(names.map((name) => this.searchPokemonByName(name))) : of([]),
      ),
      catchError(() => of([])),
    );
  }

  getPokemonByType(
    type: string,
    offset = 0,
    limit = PokemonApiService.DEFAULT_LIMIT,
  ): Observable<PokemonPage> {
    return this.http.get<PokemonTypeResponse>(`${this.baseUrl}/type/${type}`).pipe(
      switchMap((response) => {
        const resources = this.speciesOnly(response.pokemon.map((item) => item.pokemon));
        const batch = resources.slice(offset, offset + limit);
        const hasNext = offset + batch.length < resources.length;
        return forkJoin(batch.map((item) => this.getPokemonDetail(item.url))).pipe(
          map((pokemon) => ({ pokemon, next: hasNext ? `${offset + limit}` : null })),
        );
      }),
    );
  }

  getPokemonInRange(
    min: number,
    max: number,
    offset = 0,
    limit = PokemonApiService.DEFAULT_LIMIT,
  ): Observable<PokemonPage> {
    return this.getPokemonNameList().pipe(
      switchMap((results) => {
        const inRange = results.filter((item) => {
          const match = item.url.match(/\/(\d+)\/$/);
          if (!match) {
            return false;
          }
          const id = Number(match[1]);
          return id >= min && id <= max;
        });
        const batch = inRange.slice(offset, offset + limit);
        const hasNext = offset + batch.length < inRange.length;
        if (batch.length === 0) {
          return of({ pokemon: [], next: null });
        }
        return forkJoin(batch.map((item) => this.getPokemonDetail(item.url))).pipe(
          map((pokemon) => ({ pokemon, next: hasNext ? `${offset + limit}` : null })),
        );
      }),
      catchError(() => of({ pokemon: [], next: null })),
    );
  }

  getPokemonDetails(id: number, lang = 'en'): Observable<PokemonDetails> {
    return forkJoin({
      detail: this.http.get<PokemonDetailResponse>(`${this.baseUrl}/pokemon/${id}`),
      species: this.http.get<PokemonSpeciesResponse>(`${this.baseUrl}/pokemon-species/${id}`),
    }).pipe(
      switchMap(({ detail, species }) =>
        this.http.get<EvolutionChainResponse>(species.evolution_chain.url).pipe(
          switchMap((chain) =>
            forkJoin(
              this.flattenEvolutionChain(chain.chain).map((name) =>
                this.http
                  .get<PokemonDetailResponse>(`${this.baseUrl}/pokemon/${name}`)
                  .pipe(map((entry) => this.toEvolution(entry))),
              ),
            ),
          ),
          map((evolutions) => this.toDetails(detail, species, evolutions, lang)),
        ),
      ),
    );
  }

  private getPokemonNameList(): Observable<NamedApiResource[]> {
    if (this.nameListCache) {
      return of(this.nameListCache);
    }
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon`, {
        params: { limit: 5000, offset: 0 },
      })
      .pipe(
        map((page) => this.speciesOnly(page.results)),
        tap((results) => (this.nameListCache = results)),
      );
  }

  private speciesOnly(results: NamedApiResource[]): NamedApiResource[] {
    return results.filter((item) => {
      if (!item.url.includes('/pokemon/')) {
        return false;
      }
      const match = item.url.match(/\/(\d+)\/$/);
      if (!match) {
        return false;
      }
      const id = Number(match[1]);
      return id >= 1 && id <= PokemonApiService.MAX_POKEMON_ID;
    });
  }

  private getPokemonDetail(url: string): Observable<Pokemon> {
    return this.http
      .get<PokemonDetailResponse>(url)
      .pipe(map((pokemon) => this.toPokemon(pokemon)));
  }

  private toPokemon(pokemon: PokemonDetailResponse): Pokemon {
    return {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((type) => type.type.name),
      image: this.toArtwork(pokemon),
      stats: this.toStats(pokemon),
    };
  }

  private toDetails(
    detail: PokemonDetailResponse,
    species: PokemonSpeciesResponse,
    evolutions: PokemonEvolution[],
    lang: string,
  ): PokemonDetails {
    return {
      id: detail.id,
      name: detail.name,
      types: detail.types.map((type) => type.type.name),
      image: this.toArtwork(detail),
      stats: this.toStats(detail),
      height: detail.height / 10,
      weight: detail.weight / 10,
      description: this.toFlavorText(detail.id, species, lang),
      evolutions,
    };
  }

  private toStats(detail: PokemonDetailResponse): Pokemon['stats'] {
    const stat = (name: string): number =>
      detail.stats.find((entry) => entry.stat.name === name)?.base_stat ?? 0;
    return {
      hp: stat('hp'),
      attack: stat('attack'),
      defense: stat('defense'),
      specialAttack: stat('special-attack'),
      specialDefense: stat('special-defense'),
      speed: stat('speed'),
    };
  }

  private toArtwork(detail: PokemonDetailResponse): string {
    return (
      detail.sprites.other?.['official-artwork']?.front_default ??
      detail.sprites.front_default ??
      ''
    );
  }

  private toEvolution(detail: PokemonDetailResponse): PokemonEvolution {
    return {
      name: detail.name,
      image: detail.sprites.front_default ?? this.toArtwork(detail),
    };
  }

  private toFlavorText(id: number, species: PokemonSpeciesResponse, lang: string): string {
    if (lang === 'pt') {
      const localized = PT_FLAVOR_TEXTS[id];
      if (localized) {
        return localized;
      }
    }
    const entries = species.flavor_text_entries ?? [];
    const pick = (code: string): string | undefined =>
      entries.find((entry) => entry.language.name === code)?.flavor_text;
    const text = pick(lang) ?? pick('en') ?? entries[0]?.flavor_text ?? '';
    return text
      .replace(/\s*\n\s*/g, ' ')
      .replace(/\f/g, ' ')
      .trim();
  }

  private flattenEvolutionChain(link: EvolutionChainLink): string[] {
    const names = [link.species.name];
    for (const evolution of link.evolves_to ?? []) {
      names.push(...this.flattenEvolutionChain(evolution));
    }
    return names;
  }
}
