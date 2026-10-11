import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-registration-section',
  standalone: true,
  imports: [RouterModule, RevealDirective],
  templateUrl: './registration-section.component.html',
  styleUrl: './registration-section.component.scss'
})
export class RegistrationSectionComponent {
  steps: Step[] = [
    { number: '01', title: 'Vérifiez votre éligibilité', description: 'Assurez-vous d’être étudiant en Licence Professionnelle à l’IUSJC, seul ou en équipe de 2 à 5 personnes.' },
    { number: '02', title: 'Constituez votre équipe', description: 'Formez votre équipe et désignez le(s) porteur(s) du projet. Prévoyez un encadreur si nécessaire.' },
    { number: '03', title: 'Remplissez le formulaire', description: 'Renseignez le titre, la problématique, les objectifs, le principe de fonctionnement et l’innovation de votre projet.' },
    { number: '04', title: 'Soumettez votre candidature', description: 'Joignez votre dossier descriptif (max 48 Mo) et signez l’engagement de conformité au règlement.' },
    { number: '05', title: 'Recevez la confirmation', description: 'Un email de confirmation vous sera envoyé après examen automatique de votre dossier.' }
  ];

  faq: FaqItem[] = [
    { question: 'Qui peut participer ?', answer: 'Les étudiants du Campus d’Etok-Koss en cycle Licence Professionnelle, en individuel ou en équipe.' },
    { question: 'L’inscription est-elle gratuite ?', answer: 'Oui, la participation au Prix SJI INNOVA est entièrement gratuite.' },
    { question: 'Peut-on participer seul ?', answer: 'Oui, vous pouvez candidater seul ou constituer une équipe de 2 à 5 membres.' },
    { question: 'Quelle est la date limite ?', answer: 'Le dépôt des dossiers est ouvert jusqu’au 20 février 2026.' },
    { question: 'Quels documents sont nécessaires ?', answer: 'Un dossier descriptif au format PDF, PPT, MP4, ZIP ou RAR (max 48 Mo) est requis.' }
  ];
}
