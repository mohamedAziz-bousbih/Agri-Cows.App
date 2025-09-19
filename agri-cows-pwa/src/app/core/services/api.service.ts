import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}
  get<T>(url: string, params?: Record<string, any>) {
    let p = new HttpParams();
    if (params) Object.keys(params).forEach(k => p = p.set(k, params[k]));
    return this.http.get<T>(url, { params: p });
  }
  post<T>(url: string, body: any) { return this.http.post<T>(url, body); }
  put<T>(url: string, body: any) { return this.http.put<T>(url, body); }
  delete<T>(url: string) { return this.http.delete<T>(url); }
}
