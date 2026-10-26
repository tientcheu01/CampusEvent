import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';

export interface GalleryCategory {
  id: string;
  label: string;
  description: string;
  /** Nombre de fichiers galerie/<id>-NN.jpeg présents dans public/. */
  count: number;
  /** Les photos d'une même série partagent cadrage et sujet : une seule description suffit. */
  alt: string;
  portrait: boolean;
}

export interface GalleryPhoto {
  id: string;
  /** Version large (1600 px), chargée seulement à l'ouverture de la visionneuse. */
  src: string;
  /** Vignette (700 px) utilisée par la grille : 35 images ne doivent pas peser 8 Mo. */
  thumb: string;
  alt: string;
  cat: GalleryCategory;
  span: string;
}

const CATEGORIES: GalleryCategory[] = [
  {
    id: 'ceremonie',
    label: 'La cérémonie',
    description: 'Le jury, la salle et les temps forts de la remise des prix au campus d’Etok-Koss.',
    count: 8,
    alt: 'Vue d’ensemble de la cérémonie SJI INNOVA au campus d’Etok-Koss',
    portrait: false,
  },
  {
    id: 'equipes',
    label: 'Les équipes primées',
    description: 'Les équipes distinguées posent avec leurs attestations, projet par projet.',
    count: 10,
    alt: 'Une équipe primée pose avec ses attestations',
    portrait: false,
  },
  {
    id: 'remise',
    label: 'La remise des attestations',
    description: 'Les poignées de main et les attestations remises une à une aux participants.',
    count: 17,
    alt: 'Remise d’une attestation à un participant',
    portrait: true,
  },
];

/** Paysage : on alterne large et standard pour éviter une grille trop régulière. Portrait : toujours haut. */
function buildPhotos(): GalleryPhoto[] {
  return CATEGORIES.flatMap((cat) =>
    Array.from({ length: cat.count }, (_, i) => {
      const n = String(i + 1).padStart(2, '0');
      return {
        id: `${cat.id}-${n}`,
        src: `/assets/images/galerie/${cat.id}-${n}.jpeg`,
        thumb: `/assets/images/galerie/thumb/${cat.id}-${n}.jpeg`,
        alt: `${cat.alt} (${i + 1})`,
        cat,
        span: cat.portrait ? 'gallery__card--tall' : i % 3 === 0 ? 'gallery__card--wide' : 'gallery__card--standard',
      };
    }),
  );
}

/** /galerie : une galerie bento filtrable, consacrée aux moments de la première édition. */
@Component({
  selector: 'sji-affiche',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './affiche.component.html',
  styleUrl: './affiche.component.scss',
})
export class AfficheComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly allPhotos = buildPhotos();

  protected readonly categories = CATEGORIES;
  protected readonly allCount = this.allPhotos.length;
  protected readonly filter = signal<string | null>(null);
  protected readonly selectedIndex = signal<number | null>(null);

  protected readonly photos = computed(() => {
    const f = this.filter();
    return f === null ? this.allPhotos : this.allPhotos.filter((p) => p.cat.id === f);
  });

  /** Les photos visibles, regroupées par série : c'est l'ordre affiché dans la page. */
  protected readonly groups = computed(() => {
    const visible = this.photos();
    return this.categories
      .map((cat) => ({
        cat,
        items: visible.flatMap((p, index) => (p.cat.id === cat.id ? [{ photo: p, index }] : [])),
      }))
      .filter((g) => g.items.length > 0);
  });

  protected readonly selected = computed(() => {
    const i = this.selectedIndex();
    return i === null ? null : (this.photos()[i] ?? null);
  });

  /** Nombre sur deux chiffres : 01, 02 … 35. */
  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  /** Numéro affiché pour l'index i (base 0). */
  protected num(i: number): string {
    return this.pad(i + 1);
  }

  protected setFilter(id: string | null): void {
    this.close();
    this.filter.set(id);
  }

  protected open(index: number): void {
    this.selectedIndex.set(index);
    this.document.body.style.overflow = 'hidden';
  }

  protected close(): void {
    this.selectedIndex.set(null);
    this.document.body.style.removeProperty('overflow');
  }

  protected previous(): void {
    const i = this.selectedIndex();
    if (i !== null) this.selectedIndex.set((i - 1 + this.photos().length) % this.photos().length);
  }

  protected next(): void {
    const i = this.selectedIndex();
    if (i !== null) this.selectedIndex.set((i + 1) % this.photos().length);
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.selectedIndex() === null) return;
    if (event.key === 'Escape') this.close();
    if (event.key === 'ArrowLeft') this.previous();
    if (event.key === 'ArrowRight') this.next();
  }

  ngOnDestroy(): void {
    this.document.body.style.removeProperty('overflow');
  }
}
