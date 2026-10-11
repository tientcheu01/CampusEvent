import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoSvgComponent } from '../logo-svg/logo-svg.component';

export interface HeaderLink {
  label: string;
  route?: string[];
  fragment?: string;
  external?: string;
  download?: string;
  isButton?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoSvgComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() transparent = false;
  @Input() links: HeaderLink[] = [];

  isScrolled = false;
  mobileMenuOpen = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    if (window.innerWidth <= 768) {
      this.mobileMenuOpen = false;
    }
  }
}
