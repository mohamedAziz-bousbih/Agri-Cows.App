import { Component, OnInit } from '@angular/core';
import { CowsService } from '../../core/services/cows.service';
import { Vache } from '../../models/vache';

@Component({
  selector: 'app-cows-list',
  templateUrl: './cows-list.component.html',
  styleUrls: ['./cows-list.component.css']

})
export class CowsListComponent implements OnInit {
  constructor(private cows: CowsService) {}
  q = '';
  loading = false;
  list: Vache[] = [];

  get filtered(): Vache[] {
    const k = this.q.trim();
    if (!k) return this.list;
    return this.list.filter(v => (v.id+'').includes(k));
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.cows.list().subscribe({
      next: (d) => { this.list = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  remove(id: number) {
    if (!confirm('Supprimer cette vache ?')) return;
    this.cows.delete(id).subscribe(() => this.load());
  }
}
