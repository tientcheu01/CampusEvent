import { Injectable, inject } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MotionService } from './motion.service';

/** Précharge uniquement les routes marquées `data.preload`, et jamais en mode économie (data comptée). */
@Injectable({ providedIn: 'root' })
export class PreloadMarkedRoutes implements PreloadingStrategy {
  private readonly motion = inject(MotionService);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.['preload'] && !this.motion.lite ? load() : of(null);
  }
}
