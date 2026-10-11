import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// Icônes au trait de 1,5 px (grille 24), dans le style Lucide. Posées nues : jamais de pastille colorée.
const PATHS = {
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  download: 'M12 4v11M7 11l5 5 5-5M5 20h14',
  upload: 'M12 16V5M7 9l5-5 5 5M5 20h14',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  chat: 'M4 20l1.3-4.2A8 8 0 1 1 8.2 18.8L4 20z',
  pin: 'M12 21s7-6.200 7-11a7 7 0 1 0-14 0c0 4.800 7 11 7 11zM12 12a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5z',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6',
  video: 'M3 7h12v10H3zM15 11l6-3v8l-6-3',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01',
  check: 'M5 12.5 9.5 17 19 7',
  plus: 'M12 5v14M5 12h14',
  x: 'M6 6l12 12M18 6 6 18',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6 6 0 0 1 3.5 6',
  grad: 'M2 9l10-5 10 5-10 5zM6 11.5V16c0 1.500 2.700 3 6 3s6-1.500 6-3v-4.500M22 9v6',
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  chip: 'M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
  share: 'M6 14v5h12v-5M12 4v11M8 8l4-4 4 4',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  chevron: 'M6 9l6 6 6-6',
  send: 'M4 12l16-8-6 16-3-7-7-1z',
  alert: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  // Réseaux : tracés simplifiés, même grille 24 et même épaisseur que le reste.
  facebook: 'M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V3h-2a4 4 0 0 0-4 4v1.5H9V11h2v10h3V11h2.2l.3-2.5H14z',
  instagram: 'M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM16.8 7.2h.01',
  linkedin: 'M4.5 9.5h3V20h-3zM6 4.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM10.5 20V9.5h3v1.4a3.6 3.6 0 0 1 3.2-1.6c2.3 0 3.8 1.5 3.8 4.2V20h-3v-5.8c0-1.4-.6-2.2-1.8-2.2s-2.2.9-2.2 2.4V20z',
} as const;

export type IconName = keyof typeof PATHS;

@Component({
  selector: 'sji-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg
    [attr.width]="size()"
    [attr.height]="size()"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path [attr.d]="d()" />
  </svg>`,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
      color: var(--blue-600);
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<20 | 24>(20);
  protected readonly d = computed(() => PATHS[this.name()]);
}
