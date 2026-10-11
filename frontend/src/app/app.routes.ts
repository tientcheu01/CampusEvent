import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./features/inscription/inscription.component').then(m => m.InscriptionComponent)
  },
  {
    path: 'merci',
    loadComponent: () => import('./features/merci/merci.component').then(m => m.MerciComponent)
  },
  {
    path: 'fin',
    loadComponent: () => import('./features/fin/fin.component').then(m => m.FinComponent)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
