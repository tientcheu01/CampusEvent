import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject, signal } from '@angular/core';

interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  span: string;
}

/** /galerie : une galerie bento interactive consacrée aux visages et aux moments de SJI INNOVA. */
@Component({
  selector: 'sji-affiche',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './affiche.component.html',
  styleUrl: './affiche.component.scss',
})
export class AfficheComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  protected readonly selectedIndex = signal<number | null>(null);
  protected readonly photos: GalleryPhoto[] = [
    { id: 1, src: '/assets/images/equipe.webp', alt: 'Le collectif étudiant SJI INNOVA réuni sur le campus', title: 'Une génération qui ose', description: 'Les talents du campus réunis autour d’une même envie : imaginer des solutions qui comptent.', span: 'gallery__card--wide' },
    { id: 2, src: '/assets/images/ChatGPT Image 21 déc. 2025, 03_31_38.png', alt: 'Des étudiants portant les couleurs de SJI INNOVA', title: 'L’esprit SJI INNOVA', description: 'Une communauté étudiante réunie autour de la créativité et de l’innovation.', span: 'gallery__card--wide' },
    { id: 3, src: '/assets/images/etudiant-1.webp', alt: 'Portrait d’un étudiant participant à SJI INNOVA', title: 'Imaginer', description: 'Regarder un problème autrement et faire naître une première idée.', span: 'gallery__card--tall' },
    { id: 4, src: '/assets/images/etudiant-2.webp', alt: 'Portrait d’une étudiante participant à SJI INNOVA', title: 'Créer', description: 'Donner une forme concrète à une intuition audacieuse.', span: 'gallery__card--standard' },
    { id: 5, src: '/assets/images/etudiant-3.webp', alt: 'Portrait d’un étudiant participant à SJI INNOVA', title: 'Construire', description: 'Transformer les compétences acquises en une solution tangible.', span: 'gallery__card--standard' },
    { id: 6, src: '/assets/images/etudiant-4.webp', alt: 'Portrait d’une étudiante participant à SJI INNOVA', title: 'Partager', description: 'Présenter son ambition et la faire grandir avec les autres.', span: 'gallery__card--tall' },
    { id: 7, src: '/assets/images/Jeune homme en réalité virtuelle.png', alt: 'Jeune homme utilisant un casque de réalité virtuelle', title: 'Prototyper', description: 'Tester, améliorer et apprendre à chaque nouvelle version.', span: 'gallery__card--standard' },
    { id: 8, src: '/assets/images/Projet Lauréat.jpg', alt: 'L’équipe du projet LearnMap avec ses diplômes', title: 'LearnMap', description: 'Le projet lauréat et son équipe distingués lors de l’édition précédente.', span: 'gallery__card--wide' },
    { id: 9, src: '/assets/images/photo_2026-10-12_04-28-32.jpg', alt: 'Des lauréats présentant leurs diplômes d’excellence', title: 'L’excellence récompensée', description: 'Des étudiantes et étudiants reconnus pour la qualité de leurs projets.', span: 'gallery__card--standard' },
    { id: 10, src: '/assets/images/photo_2026-10-12_04-28-39.jpg', alt: 'Les membres du jury évaluant les projets', title: 'Le regard du jury', description: 'Des projets évalués avec attention selon des critères partagés.', span: 'gallery__card--wide' },
    { id: 11, src: '/assets/images/Troisième prix.jpg', alt: 'Les lauréats du troisième prix avec leurs diplômes', title: 'Troisième prix', description: 'Une équipe récompensée pour sa créativité et son potentiel d’impact.', span: 'gallery__card--standard' },
    { id: 12, src: '/assets/images/photo_2026-10-12_04-34-57.jpg', alt: 'Une équipe étudiante présentant ses diplômes d’excellence', title: 'Une équipe engagée', description: 'Des talents réunis autour d’une solution pensée pour être utile.', span: 'gallery__card--tall' },
    { id: 13, src: '/assets/images/photo_2026-10-12_06-33-39.jpg', alt: 'Une participante félicitant un étudiant lors de la remise des distinctions', title: 'La reconnaissance', description: 'Un moment de partage à l’issue de la présentation des projets.', span: 'gallery__card--wide' },
  ];

  protected selected(): GalleryPhoto | null {
    const index = this.selectedIndex();
    return index === null ? null : this.photos[index];
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
    const index = this.selectedIndex();
    if (index !== null) this.selectedIndex.set((index - 1 + this.photos.length) % this.photos.length);
  }

  protected next(): void {
    const index = this.selectedIndex();
    if (index !== null) this.selectedIndex.set((index + 1) % this.photos.length);
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
