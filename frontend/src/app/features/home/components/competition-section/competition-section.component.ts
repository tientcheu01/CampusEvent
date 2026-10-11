import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface InfoCard {
  icon: string;
  title: string;
  description: string;
}

interface KeyFigure {
  value: string;
  label: string;
}

@Component({
  selector: 'app-competition-section',
  standalone: true,
  imports: [RouterModule, RevealDirective],
  templateUrl: './competition-section.component.html',
  styleUrl: './competition-section.component.scss'
})
export class CompetitionSectionComponent {
  infoCards: InfoCard[] = [
    { icon: 'fa-bullseye', title: 'Objectif', description: 'Valoriser l\'innovation, l\'entrepreneuriat et l\'esprit créatif des étudiants de cycle Licence Professionnelle.' },
    { icon: 'fa-users', title: 'Public cible', description: 'Étudiants du Campus d\'Etok-Koss, en individuel ou en équipe de 2 à 5 personnes.' },
    { icon: 'fa-cogs', title: 'Format', description: 'Dépôt d\'un dossier projet, présélection par le jury, puis grande finale et remise des prix.' },
    { icon: 'fa-lightbulb', title: 'Innovation', description: 'Des solutions technologiques novées répondant à des besoins réels et impactants.' },
    { icon: 'fa-chart-line', title: 'Impact', description: 'Impacts social, économique, environnemental, académique et technologique encouragés.' },
    { icon: 'fa-trophy', title: 'Récompenses', description: 'Trophées, accompagnement incubation, mentorat et prix en espèces jusqu\'à 100 000 FCFA.' }
  ];

  keyFigures: KeyFigure[] = [
    { value: '3', label: 'Prix principaux' },
    { value: '5', label: 'Critères d\'évaluation' },
    { value: '2-5', label: 'Membres par équipe' },
    { value: '48', label: 'Mo max par dossier' }
  ];
}
