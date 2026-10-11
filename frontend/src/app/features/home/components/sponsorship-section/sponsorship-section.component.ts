import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface Level {
  name: string;
  className: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-sponsorship-section',
  standalone: true,
  imports: [RouterModule, RevealDirective],
  templateUrl: './sponsorship-section.component.html',
  styleUrl: './sponsorship-section.component.scss'
})
export class SponsorshipSectionComponent {
  benefits: Benefit[] = [
    { icon: 'fa-eye', title: 'Visibilité', description: 'Mettez votre marque en avant auprès des étudiants, jurés et partenaires de l’événement.' },
    { icon: 'fa-users', title: 'Talents', description: 'Accédez à un vivier de profils innovants et motivés pour vos recrutements futurs.' },
    { icon: 'fa-award', title: 'Image employeur', description: 'Renforcez votre notoriété en soutenant l’innovation et l’éducation au Cameroun.' },
    { icon: 'fa-bullhorn', title: 'Communication', description: 'Bénéficiez d’une présence sur les supports digitaux et physiques de la compétition.' }
  ];

  levels: Level[] = [
    { name: 'Bronze', className: 'bronze', description: '[À COMPLÉTER — Contenu du pack]', features: ['Logo sur le site', 'Mention réseaux sociaux'] },
    { name: 'Silver', className: 'silver', description: '[À COMPLÉTER — Contenu du pack]', features: ['Pack Bronze', 'Stand lors de la finale'] },
    { name: 'Gold', className: 'gold', description: '[À COMPLÉTER — Contenu du pack]', features: ['Pack Silver', 'Intervention jury/mentor', 'Visibility premium'] },
    { name: 'Premium', className: 'premium', description: '[À COMPLÉTER — Contenu du pack]', features: ['Pack Gold', 'Partenaire officiel', 'Naming événement'] }
  ];
}
