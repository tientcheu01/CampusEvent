import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BANDE_MOTS } from '../../core/data/site-data';
import { MarqueeComponent } from '../../shared/ui/marquee.component';
import { AproposComponent } from './sections/apropos.component';
import { CalendrierComponent } from './sections/calendrier.component';
import { CtaFinalComponent } from './sections/cta-final.component';
import { FaqHomeComponent } from './sections/faq-home.component';
import { GainsComponent } from './sections/gains.component';
import { HeroComponent } from './sections/hero.component';
import { AProposHomeComponent } from './sections/a-propos-home.component';
import { ManifesteComponent } from './sections/manifeste.component';
import { PartenairesHomeComponent } from './sections/partenaires-home.component';
import { ProjetsHomeComponent } from './sections/projets-home.component';
import { TemoignagesHomeComponent } from './sections/temoignages-home.component';
import { TrajectoireComponent } from './sections/trajectoire.component';

/** Accueil : onze blocs, un composant par section. Le fil rouge est la diagonale dorée (couche globale). */
@Component({
  selector: 'sji-home',
  standalone: true,
  imports: [
    HeroComponent,
    MarqueeComponent,
    AProposHomeComponent,
    ManifesteComponent,
    AproposComponent,
    TrajectoireComponent,
    CalendrierComponent,
    GainsComponent,
    ProjetsHomeComponent,
    TemoignagesHomeComponent,
    FaqHomeComponent,
    PartenairesHomeComponent,
    CtaFinalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sji-hero />
    <sji-marquee [items]="mots" />
    <sji-a-propos-home />
    <sji-manifeste />
    <sji-apropos />
    <sji-projets-home />
    <sji-temoignages-home />
    <sji-calendrier />
    <sji-gains />
    <sji-faq-home />
    <sji-partenaires-home />
    <sji-cta-final />
    <sji-trajectoire />
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
