import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MilkService } from '../../core/services/milk.service';

@Component({
  selector: 'app-milk-list',
  templateUrl: './milk-list.component.html',
  styleUrls: ['./milk-list.component.css']
})
export class MilkListComponent implements OnInit {
  vacheId!: string;
  entries: any[] = [];
  loading = true;
  error?: string;

  constructor(private milk: MilkService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.vacheId = this.route.snapshot.paramMap.get('id') || '';
    this.load();
  }

  load() {
    this.loading = true;
    this.milk.list(this.vacheId).subscribe({
      next: (d) => { this.entries = d; this.loading = false; },
      error: (e) => { this.error = e?.error?.msg || 'Erreur'; this.loading = false; }
    });
  }

  delete(id: string) {
    this.milk.delete(this.vacheId, id).subscribe(() => this.load());
  }
}
