import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Le contexte vient de renderApplication : sans lui, Angular créerait une plateforme navigateur
// et le prérendu échouerait sur « document is not defined ».
const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
