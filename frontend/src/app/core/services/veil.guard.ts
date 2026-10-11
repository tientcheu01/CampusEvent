import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { PageTransitionService } from './page-transition.service';

const pathOf = (url: string) => url.split(/[?#]/)[0];

/** Fait monter le voile avant de changer de page (jamais pour une simple ancre ou un changement de paramètre). */
export const veilGuard: CanActivateChildFn = async (_route, state) => {
  const router = inject(Router);
  if (pathOf(state.url) !== pathOf(router.url)) await inject(PageTransitionService).cover();
  return true;
};
