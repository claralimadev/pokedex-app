import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DEFAULT_LOCALE, Locale, typeClass, typeName } from '../../core/i18n/pokemon-types';
import { Pokemon } from '../../core/models/pokemon.model';
import { FavoritesService } from '../../core/services/favorites.service';

const SHOCK_DURATION_MS = 400;

@Component({
  selector: 'app-pokemon-card',
  styleUrl: './pokemon-card.scss',
  templateUrl: './pokemon-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCard {
  readonly pokemon = input.required<Pokemon>();
  readonly language = input<Locale>(DEFAULT_LOCALE);
  readonly compareActive = input(false);
  readonly cardClick = output<Pokemon>();
  readonly compareClick = output<Pokemon>();

  private readonly favoritesService = inject(FavoritesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isCompare = computed(() => this.compareActive());
  readonly isShocking = signal(false);
  readonly isFavorite = computed(() => this.favoritesService.isFavorite(this.pokemon().id));

  onClick(): void {
    this.cardClick.emit(this.pokemon());
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggle(this.pokemon().id);
    this.triggerShock();
  }

  toggleCompare(event: Event): void {
    event.stopPropagation();
    this.compareClick.emit(this.pokemon());
  }

  typeName(type: string): string {
    return typeName(this.language(), type);
  }

  typeClass(type: string): string {
    return typeClass(type);
  }

  private triggerShock(): void {
    this.isShocking.set(true);
    const timer = window.setTimeout(() => this.isShocking.set(false), SHOCK_DURATION_MS);
    this.destroyRef.onDestroy(() => window.clearTimeout(timer));
  }
}
