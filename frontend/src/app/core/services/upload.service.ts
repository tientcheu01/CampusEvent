import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, filter, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UploadProgress } from '../models/api.model';

/** Téléversement direct vers Vercel Blob via une URL signée, avec progression réelle. */
@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);

  upload(file: File): Observable<UploadProgress> {
    const name = encodeURIComponent(file.name);
    if (!environment.production) return of({ progress: 100, url: `https://demo.sji-innova.local/${name}` }).pipe(delay(500));
    return this.http.post<{ url: string }>(`${environment.uploadUrl}?filename=${name}`, null).pipe(
      switchMap(({ url }) =>
        this.http.request(
          new HttpRequest('PUT', url, file, {
            headers: new HttpHeaders({ 'Content-Type': file.type || 'application/octet-stream' }),
            reportProgress: true,
          }),
        ),
      ),
      filter((e) => e.type === HttpEventType.UploadProgress || e.type === HttpEventType.Response),
      map((e): UploadProgress => {
        if (e.type === HttpEventType.UploadProgress) {
          return { progress: e.total ? Math.round((100 * e.loaded) / e.total) : 0 };
        }
        const body = (e as { body?: { url?: string } }).body;
        if (!body?.url) throw new Error('Réponse de téléversement inattendue');
        return { progress: 100, url: body.url };
      }),
    );
  }
}
