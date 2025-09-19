import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { Vache } from '../../models/vache';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CowsService {
  private base = `${environment.apiBaseUrl}/vaches`;
  constructor(private api: ApiService) {}
  list(): Observable<Vache[]> { return this.api.get<Vache[]>(this.base); }
  get(id: number): Observable<Vache> { return this.api.get<Vache>(`${this.base}/${id}`); }
  create(fd: FormData): Observable<Vache> { return this.api.post<Vache>(this.base, fd); }
  update(id: number, body: any): Observable<Vache> { return this.api.put<Vache>(`${this.base}/${id}`, body); }
  delete(id: number) { return this.api.delete(`${this.base}/${id}`); }
}
