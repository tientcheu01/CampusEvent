import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import site from '../../../environments/site.json';

export interface SeoData {
  title: string;
  description: string;
  /** Chemin d'une image 1200×630 sous /assets/og/ (défaut : og-default.png). */
  image?: string;
  noindex?: boolean;
}

export const SITE_URL: string = site.url;
const DEFAULT_IMAGE = 'og-default.png';

/**
 * Titre, description, Open Graph et canonical à chaque changement de route.
 * Les valeurs sont déclarées dans les `data` de chaque route (clé `seo`), pas dans les composants.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);

  init(): void {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      const data = this.deepest(this.router.routerState.snapshot.root).data['seo'] as SeoData | undefined;
      if (data) this.set(data, e.urlAfterRedirects);
    });
  }

  set(data: SeoData, url = this.router.url): void {
    const path = url.split(/[?#]/)[0];
    const canonical = SITE_URL + (path === '/' ? '/' : path.replace(/\/$/, ''));
    const image = `${SITE_URL}/assets/og/${data.image ?? DEFAULT_IMAGE}`;

    this.title.setTitle(data.title);
    const tags: Record<string, string> = {
      description: data.description,
      robots: data.noindex ? 'noindex, nofollow' : 'index, follow',
      'og:title': data.title,
      'og:description': data.description,
      'og:url': canonical,
      'og:image': image,
      'twitter:title': data.title,
      'twitter:description': data.description,
      'twitter:image': image,
    };
    for (const [key, content] of Object.entries(tags)) {
      const attr = key.startsWith('og:') ? 'property' : 'name';
      this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    }
    this.setCanonical(canonical);
  }

  private setCanonical(href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private deepest(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (route.firstChild) route = route.firstChild;
    return route;
  }
}
