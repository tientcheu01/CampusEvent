import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlertePayload, ContactPayload, DepotPayload, DepotResponse, OkResponse, PartenariatPayload } from '../models/api.model';

/** Les quatre fonctions serverless de /api (voir ../api à la racine du dépôt). */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  depot(payload: DepotPayload): Observable<DepotResponse> {
    if (!environment.production) return of({ success: true, numero: `SJI-DEMO-${Date.now().toString().slice(-6)}` }).pipe(delay(900));
    return this.http.post<DepotResponse>(`${this.base}/submit`, payload);
  }
  contact(payload: ContactPayload): Observable<OkResponse> {
    if (!environment.production) return of({ success: true }).pipe(delay(700));
    return this.http.post<OkResponse>(`${this.base}/contact`, payload);
  }
  partenariat(payload: PartenariatPayload): Observable<OkResponse> {
    if (!environment.production) return of({ success: true }).pipe(delay(800));
    return this.http.post<OkResponse>(`${this.base}/partenariat`, payload);
  }
  alerte(payload: AlertePayload): Observable<OkResponse> {
    if (!environment.production) return of({ success: true }).pipe(delay(600));
    return this.http.post<OkResponse>(`${this.base}/alerte`, payload);
  }
}
