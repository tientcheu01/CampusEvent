import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, last, map, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UploadUrlResponse } from '../models/inscription.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly uploadUrlEndpoint = environment.uploadUrl;

  constructor(private readonly http: HttpClient) {}

  uploadFile(file: File): Observable<string> {
    const encodedName = encodeURIComponent(file.name);
    return this.http
      .post<UploadUrlResponse>(`${this.uploadUrlEndpoint}?filename=${encodedName}`, null)
      .pipe(
        switchMap((response) => this.putFile(response.url, file)),
        map((event: HttpEvent<unknown>) => {
          if (event.type === 4) {
            const body = event.body as { url?: string } | null;
            if (body?.url) {
              return body.url;
            }
          }
          throw new Error('Réponse d\'upload inattendue');
        }),
        last()
      );
  }

  private putFile(url: string, file: File): Observable<HttpEvent<unknown>> {
    const request = new HttpRequest('PUT', url, file, {
      headers: new HttpHeaders({ 'Content-Type': file.type || 'application/octet-stream' }),
      reportProgress: true,
    });
    return this.http.request(request);
  }
}
