import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
  size?: 'normal' | 'wide' | 'tall';
}

@Component({
  selector: 'app-gallery-section',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './gallery-section.component.html',
  styleUrl: './gallery-section.component.scss'
})
export class GallerySectionComponent implements OnDestroy {
  images: GalleryImage[] = [
    { src: '/assets/images/Logo-Institut-USJ-INGENIEUR-transparent-768x301%20(3).png', alt: 'Logo IUSJC', category: 'Institution', size: 'wide' },
    { src: '/assets/images/school-logo.svg', alt: 'Logo SJI', category: 'Événement', size: 'normal' },
    { src: '/assets/images/ChatGPT%20Image%2021%20d%C3%A9c.%202025,%2003_31_38.png', alt: 'Visuel événement', category: 'Ambiance', size: 'tall' },
    { src: '/assets/images/Logo-Institut-USJ-INGENIEUR-transparent-768x301%20(3).png', alt: 'Édition précédente — À compléter', category: 'Moments forts', size: 'normal' },
    { src: '/assets/images/school-logo.svg', alt: 'Cérémonie — À compléter', category: 'Cérémonie', size: 'normal' },
    { src: '/assets/images/ChatGPT%20Image%2021%20d%C3%A9c.%202025,%2003_31_38.png', alt: 'Atelier — À compléter', category: 'Ateliers', size: 'wide' },
    { src: '/assets/images/Logo-Institut-USJ-INGENIEUR-transparent-768x301%20(3).png', alt: 'Partenaire — À compléter', category: 'Partenaires', size: 'normal' },
    { src: '/assets/images/school-logo.svg', alt: 'Remise des prix — À compléter', category: 'Remise des prix', size: 'normal' }
  ];

  selectedIndex: number | null = null;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.selectedIndex !== null) this.next();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.selectedIndex !== null) this.prev();
  }

  ngOnDestroy(): void {
    this.selectedIndex = null;
  }

  open(index: number): void {
    this.selectedIndex = index;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.selectedIndex = null;
    document.body.style.overflow = '';
  }

  next(): void {
    if (this.selectedIndex === null) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.images.length;
  }

  prev(): void {
    if (this.selectedIndex === null) return;
    this.selectedIndex = (this.selectedIndex - 1 + this.images.length) % this.images.length;
  }
}
