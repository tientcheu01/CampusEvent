import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactPayload, ContactResponse } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly contactUrl = `${environment.apiUrl}/contact`;

  constructor(private readonly http: HttpClient) {}

  send(payload: ContactPayload): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.contactUrl, payload, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    });
  }
}
