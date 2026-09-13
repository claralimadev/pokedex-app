import { Component, inject, output, signal } from '@angular/core';
import { Pokemon } from '../../core/models/pokemon.model';
import { PokemonApiService } from '../../core/services/pokemon-api.service';

const NAME_POOL = [
  'bulbasaur',
  'charmander',
  'squirtle',
  'pikachu',
  'jigglypuff',
  'meowth',
  'psyduck',
  'growlithe',
  'gengar',
  'onix',
  'machamp',
  'cubone',
  'gyarados',
  'eevee',
  'snorlax',
  'dragonite',
  'mewtwo',
  'mew',
  'ho-oh',
  'rayquaza',
  'arceus',
  'giratina',
  'kyurem',
  'xerneas',
  'necrozma',
  'eternatus',
  'koraidon',
  'miraidon',
];

const MAX_LIVES = 3;
const BEST_KEY = 'pokedex-quiz-best';

type Phase = 'guessing' | 'reveal';

@Component({
  selector: 'app-pokemon-quiz',
  styleUrl: './pokemon-quiz.scss',
  templateUrl: './pokemon-quiz.html',
})
export class PokemonQuiz {
  readonly close = output<void>();

  private readonly api = inject(PokemonApiService);

  readonly isLoading = signal(true);
  readonly pokemon = signal<Pokemon | null>(null);
  readonly options = signal<string[]>([]);
  readonly guess = signal<string | null>(null);
  readonly phase = signal<Phase>('guessing');
  readonly score = signal(0);
  readonly round = signal(0);
  readonly lives = signal(MAX_LIVES);
  readonly isGameOver = signal(false);
  readonly best = signal(this.initialBest());
  readonly maxLives = MAX_LIVES;

  constructor() {
    this.newQuestion();
  }

  newQuestion(): void {
    if (this.isGameOver()) {
      return;
    }
    this.round.update((value) => value + 1);
    this.phase.set('guessing');
    this.guess.set(null);

    if (this.pending) {
      this.applyPokemon(this.pending);
      this.pending = null;
    } else {
      this.isLoading.set(true);
      this.fetchQuestion();
    }
    this.prefetchNext();
  }

  select(option: string): void {
    if (this.phase() === 'reveal' || this.isGameOver()) {
      return;
    }
    this.guess.set(option);
    if (option === this.pokemon()?.name) {
      this.score.update((value) => value + 1);
      this.persistBest();
    } else {
      this.lives.update((value) => Math.max(0, value - 1));
      if (this.lives() === 0) {
        this.endGame();
      }
    }
    this.phase.set('reveal');
  }

  restart(): void {
    this.score.set(0);
    this.round.set(0);
    this.lives.set(MAX_LIVES);
    this.isGameOver.set(false);
    this.phase.set('guessing');
    this.guess.set(null);
    this.newQuestion();
  }

  guessedWrong(option: string): boolean {
    return this.phase() === 'reveal' && option === this.guess() && option !== this.pokemon()?.name;
  }

  private pending: Pokemon | null = null;

  private applyPokemon(pokemon: Pokemon): void {
    this.pokemon.set(pokemon);
    this.options.set(this.buildOptions(pokemon.name));
    this.isLoading.set(false);
    this.preloadImage(pokemon.image);
  }

  private fetchQuestion(): void {
    this.api.searchPokemonByName(String(this.randomId())).subscribe({
      next: (pokemon) => this.applyPokemon(pokemon),
      error: () => this.isLoading.set(false),
    });
  }

  private prefetchNext(): void {
    this.api.searchPokemonByName(String(this.randomId())).subscribe({
      next: (pokemon) => {
        this.pending = pokemon;
        this.preloadImage(pokemon.image);
      },
      error: () => undefined,
    });
  }

  private preloadImage(url: string): void {
    if (!url) {
      return;
    }
    const image = new Image();
    image.src = url;
  }

  private persistBest(): void {
    if (this.score() > this.best()) {
      this.best.set(this.score());
      localStorage.setItem(BEST_KEY, String(this.score()));
    }
  }

  private endGame(): void {
    this.persistBest();
    this.isGameOver.set(true);
  }

  private initialBest(): number {
    const stored = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  }

  private buildOptions(correct: string): string[] {
    const distractors = NAME_POOL.filter((name) => name !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [...distractors, correct].sort(() => Math.random() - 0.5);
  }

  private randomId(): number {
    if (Math.random() < 0.7) {
      return 1 + Math.floor(Math.random() * 151);
    }
    return 1 + Math.floor(Math.random() * 1025);
  }
}
