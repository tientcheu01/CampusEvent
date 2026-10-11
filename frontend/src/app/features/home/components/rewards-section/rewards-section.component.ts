import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Reward {
  rank: string;
  className: string;
  medalClass: string;
  title: string;
  amount: string;
  perks: { label: string; icon: string }[];
  featured: boolean;
}

@Component({
  selector: 'app-rewards-section',
  standalone: true,
  imports: [RouterModule, RevealDirective],
  templateUrl: './rewards-section.component.html',
  styleUrl: './rewards-section.component.scss'
})
export class RewardsSectionComponent {
  rewards: Reward[] = [
    {
      rank: '1er',
      className: 'gold-card',
      medalClass: 'gold',
      title: 'Excellence',
      amount: '100 000 FCFA',
      featured: true,
      perks: [
        { label: 'Trophée Or', icon: 'fa-trophy' },
        { label: 'Accompagnement incubation', icon: 'fa-rocket' },
        { label: 'Visibilité auprès des entreprises', icon: 'fa-star' },
        { label: 'Mentoring personnalisé', icon: 'fa-users' }
      ]
    },
    {
      rank: '2e',
      className: 'silver-card',
      medalClass: 'silver',
      title: 'Innovation',
      amount: '50 000 FCFA',
      featured: false,
      perks: [
        { label: 'Certificat de participation', icon: 'fa-certificate' }
      ]
    },
    {
      rank: '3e',
      className: 'bronze-card',
      medalClass: 'bronze',
      title: 'Espoir',
      amount: '25 000 FCFA',
      featured: false,
      perks: [
        { label: 'Certificat de participation', icon: 'fa-certificate' }
      ]
    }
  ];
}
