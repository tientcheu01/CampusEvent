import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InscriptionPayload, SubmitResponse } from '../models/inscription.model';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  private readonly submitUrl = `${environment.apiUrl}/submit`;

  constructor(private readonly http: HttpClient) {}

  submit(payload: InscriptionPayload): Observable<SubmitResponse> {
    return this.http.post<SubmitResponse>(this.submitUrl, payload, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    });
  }
}
