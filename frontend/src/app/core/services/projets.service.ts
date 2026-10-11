import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Projet } from '../models/api.model';

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';

/** Les projets viennent de public/assets/data/projets.json tant qu'il n'y a pas de back-office. */
@Injectable({ providedIn: 'root' })
export class ProjetsService {
  private readonly http = inject(HttpClient);
  readonly projets = signal<Projet[]>([]);
  readonly state = signal<LoadState>('idle');
  readonly editions = computed(() => [...new Set(this.projets().map((p) => p.edition))].sort((a, b) => b - a));
  readonly domaines = computed(() => [...new Set(this.projets().map((p) => p.domaine))].sort());
  readonly filieres = computed(() => [...new Set(this.projets().map((p) => p.filiere))].sort());

  load(force = false): void {
    if (this.state() === 'loading' || (this.state() === 'ready' && !force)) return;
    this.state.set('loading');
    this.http.get<Projet[]>('/assets/data/projets.json').subscribe({
      next: (list) => {
        this.projets.set(list);
        this.state.set('ready');
      },
      error: () => this.state.set('error'),
    });
  }

  bySlug(slug: string): Projet | undefined {
    return this.projets().find((p) => p.slug === slug);
  }
}
