import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoSvgComponent } from '../logo-svg/logo-svg.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, LogoSvgComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {}
