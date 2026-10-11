import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

interface Value {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-iusjc-section',
  standalone: true,
  imports: [RouterModule, RevealDirective],
  templateUrl: './iusjc-section.component.html',
  styleUrl: './iusjc-section.component.scss'
})
export class IusjcSectionComponent {
  values: Value[] = [
    { icon: 'fa-graduation-cap', title: 'Excellence académique', description: 'Des programmes exigeants encadrés par des enseignants et professionnels qualifiés.' },
    { icon: 'fa-lightbulb', title: 'Innovation', description: 'Un environnement propice à la création, la recherche et le développement de solutions.' },
    { icon: 'fa-rocket', title: 'Entrepreneuriat', description: 'Accompagnement des étudiants dans la création d’entreprise et l’esprit d’initiative.' },
    { icon: 'fa-hands-helping', title: 'Accompagnement', description: 'Un suivi personnalisé pour favoriser l’insertion professionnelle et l’épanouissement.' }
  ];
}
