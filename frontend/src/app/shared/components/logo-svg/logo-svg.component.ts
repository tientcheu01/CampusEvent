import { Component } from '@angular/core';

@Component({
  selector: 'app-logo-svg',
  standalone: true,
  template: `
    <svg class="logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M50 10C33.4 10 20 23.4 20 40C20 53.5 28.5 65 40 70V82C40 85.3 42.7 88 46 88H54C57.3 88 60 85.3 60 82V70C71.5 65 80 53.5 80 40C80 23.4 66.6 10 50 10Z" fill="#F4D35E" fill-opacity="0.2" stroke="#F4D35E" stroke-width="3"/>
      <path d="M50 25V45" stroke="#EE6C4D" stroke-width="3" stroke-linecap="round"/>
      <path d="M50 45L40 35M50 45L60 35" stroke="#EE6C4D" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="40" r="35" stroke="#0D3B66" stroke-width="2" stroke-dasharray="5 5"/>
      <rect x="42" y="82" width="16" height="6" rx="2" fill="#0D3B66"/>
    </svg>
  `,
  styles: [``]
})
export class LogoSvgComponent {}
