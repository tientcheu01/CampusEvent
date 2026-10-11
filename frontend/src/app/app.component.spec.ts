import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ConcoursDatesService, DATES } from './core/services/concours-dates.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('crée l’application avec un lien d’évitement cible et un <main>', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('main#contenu')).toBeTruthy();
  });
});

describe('ConcoursDatesService', () => {
  it('expose les dates du dossier de partenariat avec le décalage UTC+01:00', () => {
    expect(DATES.cloture.toISOString()).toBe('2026-12-18T22:59:59.000Z');
    expect(DATES.finale.toISOString()).toBe('2027-02-10T12:00:00.000Z');
  });

  it('calcule une phase et un libellé de bouton', () => {
    TestBed.configureTestingModule({});
    const s = TestBed.inject(ConcoursDatesService);
    expect(['avant', 'depots', 'evaluation', 'vers-finale', 'apres']).toContain(s.phase());
    expect(s.cta().label.length).toBeGreaterThan(0);
  });
});
