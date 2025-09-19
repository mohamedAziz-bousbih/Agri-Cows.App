import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MilkService {
  private baseUrl = 'http://localhost:5000/api/vaches';

  constructor(private http: HttpClient) {}

  // ✅ Create a milk record
  create(vacheId: string, payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${vacheId}/lait`, payload);
  }

  // ✅ List all milk records for a cow
  list(vacheId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${vacheId}/lait`);
  }

  // ✅ Update a milk record
  update(vacheId: string, laitId: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${vacheId}/lait/${laitId}`, payload);
  }

  // ✅ Delete a milk record
  delete(vacheId: string, laitId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${vacheId}/lait/${laitId}`);
  }
}
