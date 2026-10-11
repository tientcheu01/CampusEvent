import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SkillBarDirective } from '../../shared/directives/skill-bar.directive';
import { HeaderLink } from '../../shared/components/header/header.component';

import { CompetitionSectionComponent } from './components/competition-section/competition-section.component';
import { RegistrationSectionComponent } from './components/registration-section/registration-section.component';
import { RewardsSectionComponent } from './components/rewards-section/rewards-section.component';
import { PartnersSectionComponent } from './components/partners-section/partners-section.component';
import { GallerySectionComponent } from './components/gallery-section/gallery-section.component';
import { SponsorshipSectionComponent } from './components/sponsorship-section/sponsorship-section.component';
import { IusjcSectionComponent } from './components/iusjc-section/iusjc-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RevealDirective,
    SkillBarDirective,
    CompetitionSectionComponent,
    RegistrationSectionComponent,
    RewardsSectionComponent,
    PartnersSectionComponent,
    GallerySectionComponent,
    SponsorshipSectionComponent,
    IusjcSectionComponent,
    ContactSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  headerLinks: HeaderLink[] = [
    { label: 'Accueil', route: ['/'], fragment: 'hero' },
    { label: 'Compétition', route: ['/'], fragment: 'competition' },
    { label: 'Inscription', route: ['/'], fragment: 'inscription' },
    { label: 'Récompenses', route: ['/'], fragment: 'recompenses' },
    { label: 'Partenaires', route: ['/'], fragment: 'partenaires' },
    { label: 'Galerie', route: ['/'], fragment: 'galerie' },
    { label: 'Sponsoring', route: ['/'], fragment: 'sponsor' },
    { label: 'IUSJC', route: ['/'], fragment: 'iusjc' },
    { label: 'Contact', route: ['/'], fragment: 'contact' },
    { label: 'S\'inscrire', route: ['/inscription'], isButton: true }
  ];

  heroAnimation = false;

  criteria = [
    { icon: 'fa-lightbulb', title: 'Originalité et innovation', description: 'Votre idée apporte-t-elle une solution nouvelle et créative ?', percentage: 30, gradient: 'linear-gradient(90deg, var(--color-orange), #ff8b6d)' },
    { icon: 'fa-cogs', title: 'Faisabilité technique', description: 'Votre solution est-elle techniquement réalisable ?', percentage: 25, gradient: 'linear-gradient(90deg, var(--color-gold), #ffdd7a)' },
    { icon: 'fa-chart-line', title: 'Impact potentiel', description: 'Quel est le potentiel d\'impact de votre projet ?', percentage: 25, gradient: 'linear-gradient(90deg, #00b4d8, #48cae4)' },
    { icon: 'fa-chalkboard', title: 'Qualité de la présentation', description: 'Comment présentez-vous votre projet aux jurés ?', percentage: 20, gradient: 'linear-gradient(90deg, var(--color-blue), #1e5a8e)' }
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.heroAnimation = true;
    }, 1100);
  }
}
