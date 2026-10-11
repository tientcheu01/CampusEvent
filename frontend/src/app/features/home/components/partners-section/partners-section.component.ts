import { Component } from '@angular/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Partner {
  name: string;
  category: string;
  logo: string;
}

@Component({
  selector: 'app-partners-section',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './partners-section.component.html',
  styleUrl: './partners-section.component.scss'
})
export class PartnersSectionComponent {
  partners: Partner[] = [
    { name: 'Partenaire Premium 1', category: 'PARTENAIRE PREMIUM', logo: '/assets/images/Logo-Institut-USJ-INGENIEUR-transparent-768x301%20(3).png' },
    { name: 'Partenaire Officiel 1', category: 'PARTENAIRE OFFICIEL', logo: '/assets/images/Logo-Institut-USJ-INGENIEUR-transparent-768x301%20(3).png' },
    { name: 'Partenaire Officiel 2', category: 'PARTENAIRE OFFICIEL', logo: '/assets/images/Logo-Institut-USJ-INGENIEUR-transparent-768x301%20(3).png' },
    { name: 'Partenaire Technique 1', category: 'PARTENAIRE TECHNIQUE', logo: '/assets/images/school-logo.svg' },
    { name: 'Partenaire Média 1', category: 'PARTENAIRE MÉDIA', logo: '/assets/images/school-logo.svg' },
    { name: '[À COMPLÉTER]', category: 'À COMPLÉTER', logo: '/assets/images/school-logo.svg' }
  ];
}
