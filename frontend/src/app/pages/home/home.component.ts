import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BANDE_MOTS } from '../../core/data/site-data';
import { MarqueeComponent } from '../../shared/ui/marquee.component';
import { CalendrierComponent } from './sections/calendrier.component';
import { CtaFinalComponent } from './sections/cta-final.component';
import { FaqHomeComponent } from './sections/faq-home.component';
import { GainsComponent } from './sections/gains.component';
import { HeroComponent } from './sections/hero.component';
import { ManifesteComponent } from './sections/manifeste.component';
import { PartenairesHomeComponent } from './sections/partenaires-home.component';
import { ProjetsHomeComponent } from './sections/projets-home.component';
import { TrajectoireComponent } from './sections/trajectoire.component';

/** Accueil : onze blocs, un composant par section. Le fil rouge est la diagonale dorée (couche globale). */
@Component({
  selector: 'sji-home',
  standalone: true,
  imports: [
    HeroComponent,
    MarqueeComponent,
    ManifesteComponent,
    TrajectoireComponent,
    CalendrierComponent,
    GainsComponent,
    ProjetsHomeComponent,
    FaqHomeComponent,
    PartenairesHomeComponent,
    CtaFinalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sji-hero />
    <sji-marquee [items]="mots" />
    <sji-manifeste />
    <sji-trajectoire />
    <sji-calendrier />
    <sji-gains />
    <sji-projets-home />
    <sji-faq-home />
    <sji-partenaires-home />
    <sji-cta-final />
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class HomeComponent {
  protected readonly mots = BANDE_MOTS;
}
