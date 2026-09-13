import { Injectable, signal } from '@angular/core';

const FAVORITES_KEY = 'pokedex-favorites';

export function loadFavorites(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: number[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly favorites = signal<number[]>(loadFavorites());

  isFavorite(id: number): boolean {
    return this.favorites().includes(id);
  }

  toggle(id: number): void {
    this.favorites.update((ids) => {
      const next = ids.includes(id) ? ids.filter((fav) => fav !== id) : [...ids, id];
      saveFavorites(next);
      return next;
    });
  }
}
