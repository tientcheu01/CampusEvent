import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderLink } from '../../shared/components/header/header.component';

interface StepCard {
  icon: string;
  date: string;
  title: string;
  description: string;
  variant: 'gold' | 'orange' | 'white';
}

interface MiniItem {
  icon: string;
  variant: 'done' | 'active' | 'upcoming';
  date: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-fin',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './fin.component.html',
  styleUrl: './fin.component.scss'
})
export class FinComponent {
  headerLinks: HeaderLink[] = [
    { label: 'Accueil', route: ['/'] },
    { label: 'Le Concours', route: ['/'], fragment: 'about' },
    { label: 'Calendrier', route: ['/'], fragment: 'timeline' }
  ];

  steps: StepCard[] = [
    { icon: 'fa-check-circle', date: 'TERMINÉ — 20 Fév 2026', title: 'Dépôt des dossiers', description: 'Toutes les candidatures ont été enregistrées avec succès.', variant: 'gold' },
    { icon: 'fa-search', date: 'EN COURS — 20–27 Fév', title: 'Évaluation du jury', description: 'Notre jury analyse l\'ensemble des projets soumis.', variant: 'orange' },
    { icon: 'fa-trophy', date: 'À VENIR — 11 Mars 2026', title: 'Cérémonie de remise', description: 'Les lauréats seront célébrés au Campus d\'Etok-Koss.', variant: 'white' }
  ];

  miniTimeline: MiniItem[] = [
    { icon: 'fa-check', variant: 'done', date: '19 JAN – 20 FÉV 2026', title: 'Lancement & Dépôt', description: 'Inscription des équipes et soumission des dossiers.' },
    { icon: 'fa-search', variant: 'active', date: '20 – 27 FÉV 2026', title: 'Évaluation par le jury', description: 'Analyse et présélection des meilleurs projets.' },
    { icon: 'fa-star', variant: 'upcoming', date: '11 MARS 2026', title: 'Grande Finale', description: 'Cérémonie de remise des prix — Campus d\'Etok-Koss.' }
  ];
}
