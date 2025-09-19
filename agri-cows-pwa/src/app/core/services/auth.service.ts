import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}`;
  private key = 'jwt';

  constructor(private http: HttpClient) {}

  login(credentials: {nom: string; password: string;}): Observable<{access_token: string}> {
    return this.http.post<{access_token: string}>(`${this.apiUrl}/login`, credentials);
  }
  saveToken(token: string) { localStorage.setItem(this.key, token); }
  getToken() { return localStorage.getItem(this.key); }
  isAuthenticated() { return !!this.getToken(); }
  logout() { localStorage.removeItem(this.key); }
}
