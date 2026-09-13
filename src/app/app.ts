import { Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { PokemonCard } from './components/pokemon-card/pokemon-card';
import { PokemonQuiz } from './components/pokemon-quiz/pokemon-quiz';
import {
  GENERATIONS,
  GENERATION_HIGHLIGHTS,
  IdRange,
  REGIONS,
  inRange,
} from './core/data/classifications';
import {
  DEFAULT_LOCALE,
  Locale,
  TYPE_LIST,
  flavorLanguage,
  isLocale,
  typeClass,
  typeLabel,
  typeName,
  uiString,
} from './core/i18n/pokemon-types';
import { Pokemon, PokemonDetails, PokemonStats } from './core/models/pokemon.model';
import { FavoritesService } from './core/services/favorites.service';
import { PokemonApiService } from './core/services/pokemon-api.service';

const PAGE_LIMIT = 12;
const THEME_KEY = 'pokedex-theme';
const LANGUAGE_KEY = 'pokedex-language';
const SEARCH_DEBOUNCE_MS = 350;

interface StatBar {
  label: string;
  value: number;
  percent: number;
}

@Component({
  imports: [PokemonCard, PokemonQuiz],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly api = inject(PokemonApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly favoritesService = inject(FavoritesService);

  readonly pokemonCards = signal<Pokemon[]>([]);
  readonly searchQuery = signal('');
  readonly selectedType = signal('');
  readonly selectedGeneration = signal('');
  readonly selectedRegion = signal('');
  readonly showFavoritesFilter = signal(false);
  readonly globalSearchResult = signal<Pokemon[]>([]);
  readonly selectedPokemon = signal<Pokemon | null>(null);
  readonly pokemonDetails = signal<PokemonDetails | null>(null);
  readonly isDetailsLoading = signal(false);
  readonly compareSlots = signal<Pokemon[]>([]);
  readonly isComparing = signal(false);
  readonly hasNext = signal(true);
  readonly isLoading = signal(false);
  readonly isDark = signal(localStorage.getItem(THEME_KEY) === 'dark');
  readonly isMenuOpen = signal(false);
  readonly isClassificationOpen = signal(false);
  readonly isHighlightsOpen = signal(false);
  readonly isQuizOpen = signal(false);
  readonly classificationTab = signal<'type' | 'generation' | 'region'>('type');
  readonly selectedLanguage = signal<Locale>(this.initialLanguage());
  readonly pokemonTypes = TYPE_LIST;
  readonly generations = GENERATIONS;
  readonly regions = REGIONS;
  readonly highlights = GENERATION_HIGHLIGHTS;
  readonly skeletonItems = Array.from({ length: PAGE_LIMIT });

  private offset = 0;
  private loadToken = 0;
  private detailsToken = 0;
  private searchToken = 0;
  private searchTimer = 0;

  readonly hasActiveFilter = computed(
    () =>
      this.searchQuery() !== '' ||
      this.selectedType() !== '' ||
      this.selectedGeneration() !== '' ||
      this.selectedRegion() !== '' ||
      this.showFavoritesFilter(),
  );

  readonly filteredPokemon = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const type = this.selectedType();
    const generation = this.selectedRange(this.selectedGeneration(), GENERATIONS);
    const region = this.selectedRange(this.selectedRegion(), REGIONS);
    const showFavorites = this.showFavoritesFilter();

    return this.pokemonCards().filter((pokemon) => {
      const matchesQuery =
        query === '' ||
        pokemon.name.toLowerCase().includes(query) ||
        pokemon.id.toString().includes(query);

      const matchesType = type === '' || pokemon.types.includes(type);
      const matchesGeneration = !generation || inRange(pokemon.id, generation);
      const matchesRegion = !region || inRange(pokemon.id, region);
      const matchesFavorites = !showFavorites || this.favoritesService.isFavorite(pokemon.id);

      return matchesQuery && matchesType && matchesGeneration && matchesRegion && matchesFavorites;
    });
  });

  constructor() {
    this.applyTheme();
    this.loadPokemon();
    afterNextRender(() => {
      const video = document.querySelector<HTMLVideoElement>('.bg-pokeball-video');
      if (video) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          video.pause();
        } else {
          video.playbackRate = 0.45;
        }
      }
    });
  }

  toggleTheme(): void {
    this.isDark.update((dark) => !dark);
    localStorage.setItem(THEME_KEY, this.isDark() ? 'dark' : 'light');
    this.applyTheme();
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleClassification(): void {
    this.isClassificationOpen.update((open) => !open);
  }

  toggleHighlights(): void {
    this.isHighlightsOpen.update((open) => !open);
  }

  openHighlight(id: number): void {
    this.api.searchPokemonByName(String(id)).subscribe({
      next: (pokemon) => this.onPokemonClick(pokemon),
      error: () => undefined,
    });
  }

  openQuiz(): void {
    this.isQuizOpen.set(true);
  }

  closeQuiz(): void {
    this.isQuizOpen.set(false);
  }

  setClassificationTab(tab: 'type' | 'generation' | 'region'): void {
    this.classificationTab.set(tab);
  }

  toggleFavoritesFilter(): void {
    this.showFavoritesFilter.update((value) => !value);
  }

  private initialLanguage(): Locale {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    return isLocale(stored) ? stored : DEFAULT_LOCALE;
  }

  setLanguage(lang: string): void {
    if (!isLocale(lang)) {
      return;
    }
    this.selectedLanguage.set(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  }

  typeName(type: string): string {
    return typeName(this.selectedLanguage(), type);
  }

  typeLabel(type: string): string {
    return typeLabel(this.selectedLanguage(), type);
  }

  typeClass(type: string): string {
    return typeClass(type);
  }

  typeBtnClass(type: string): string {
    const parts = ['type-btn', typeClass(type)];
    if (this.selectedType() === type) {
      parts.push('type-btn--active');
    }
    return parts.join(' ');
  }

  statsFor(index: number): StatBar[] {
    const pokemon = this.compareSlots()[index];
    return pokemon ? this.statList(pokemon.stats) : [];
  }

  t(key: string): string {
    return uiString(this.selectedLanguage(), key);
  }

  statList(stats: PokemonStats): StatBar[] {
    const MAX = 255;
    return [
      { label: 'HP', value: stats.hp, percent: (stats.hp / MAX) * 100 },
      { label: 'ATK', value: stats.attack, percent: (stats.attack / MAX) * 100 },
      { label: 'DEF', value: stats.defense, percent: (stats.defense / MAX) * 100 },
      { label: 'SPA', value: stats.specialAttack, percent: (stats.specialAttack / MAX) * 100 },
      { label: 'SPD', value: stats.specialDefense, percent: (stats.specialDefense / MAX) * 100 },
      { label: 'VEL', value: stats.speed, percent: (stats.speed / MAX) * 100 },
    ];
  }

  isCompareSelected(id: number): boolean {
    return this.compareSlots().some((pokemon) => pokemon.id === id);
  }

  onCompareClick(pokemon: Pokemon): void {
    const current = this.compareSlots();
    if (current.some((entry) => entry.id === pokemon.id)) {
      this.compareSlots.set(current.filter((entry) => entry.id !== pokemon.id));
      return;
    }
    const next = [...current, pokemon];
    this.compareSlots.set(next);
    if (next.length === 2) {
      this.isComparing.set(true);
    }
  }

  closeCompareModal(): void {
    this.isComparing.set(false);
    this.compareSlots.set([]);
  }

  private selectedRange(id: string, ranges: IdRange[]): IdRange | null {
    return id ? (ranges.find((range) => range.id === id) ?? null) : null;
  }

  private applyTheme(): void {
    const dark = this.isDark();
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', dark);
    document.body.classList.toggle('light-theme', !dark);
  }

  private loadPokemon(): void {
    const token = ++this.loadToken;
    this.isLoading.set(true);
    const request$ = this.selectedType()
      ? this.api.getPokemonByType(this.selectedType(), this.offset)
      : this.api.getPokemonPage(this.offset);

    request$.subscribe({
      next: ({ pokemon, next }) => {
        if (token !== this.loadToken) {
          return;
        }
        this.pokemonCards.update((current) => [...current, ...pokemon]);
        this.offset += PAGE_LIMIT;
        this.hasNext.set(next !== null);
        this.isLoading.set(false);
      },
      error: () => {
        if (token === this.loadToken) {
          this.isLoading.set(false);
        }
      },
    });
  }

  private resetAndLoad(): void {
    this.offset = 0;
    this.hasNext.set(true);
    this.pokemonCards.set([]);
    this.loadPokemon();
  }

  onLoadMore(): void {
    this.loadPokemon();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    window.clearTimeout(this.searchTimer);
    const normalized = query.trim().toLowerCase();
    if (normalized === '') {
      this.globalSearchResult.set([]);
      return;
    }
    this.searchTimer = window.setTimeout(
      () => this.runGlobalSearch(normalized),
      SEARCH_DEBOUNCE_MS,
    );
  }

  private runGlobalSearch(query: string): void {
    const isId = /^\d{1,5}$/.test(query);
    if (!isId && query.length < 2) {
      return;
    }
    const token = ++this.searchToken;
    this.api.searchPokemonGlobal(query).subscribe({
      next: (pokemon) => {
        if (token !== this.searchToken) {
          return;
        }
        this.globalSearchResult.set(pokemon);
      },
      error: () => {
        if (token === this.searchToken) {
          this.globalSearchResult.set([]);
        }
      },
    });
  }

  onTypeChange(type: string): void {
    this.selectedType.set(type);
    this.resetAndLoad();
  }

  onGenerationChange(id: string): void {
    this.selectedGeneration.set(id);
  }

  onRegionChange(id: string): void {
    this.selectedRegion.set(id);
  }

  clearFilter(): void {
    this.searchQuery.set('');
    this.globalSearchResult.set([]);
    this.selectedType.set('');
    this.selectedGeneration.set('');
    this.selectedRegion.set('');
    this.showFavoritesFilter.set(false);
    this.resetAndLoad();
  }

  onPokemonClick(pokemon: Pokemon): void {
    this.selectedPokemon.set(pokemon);
    this.pokemonDetails.set(null);
    const token = ++this.detailsToken;
    this.isDetailsLoading.set(true);
    this.api.getPokemonDetails(pokemon.id, flavorLanguage(this.selectedLanguage())).subscribe({
      next: (details) => {
        if (token !== this.detailsToken) {
          return;
        }
        this.pokemonDetails.set(details);
        this.isDetailsLoading.set(false);
      },
      error: () => {
        if (token === this.detailsToken) {
          this.isDetailsLoading.set(false);
        }
      },
    });
  }

  closeModal(): void {
    this.detailsToken++;
    this.selectedPokemon.set(null);
    this.pokemonDetails.set(null);
    this.isDetailsLoading.set(false);
  }
}
